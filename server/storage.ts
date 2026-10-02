// server/storage.ts
// Persistence for the in-memory ZemaHub database.
// - File storage (default): one JSON file — simple for local development.
// - MongoDB storage (when MONGODB_URI is set): survives restarts/redeploys on hosts without a disk,
//   e.g. Render's free plan with a free MongoDB Atlas cluster. Only changed documents are written.

import fs from "fs";
import path from "path";
import { MongoClient, Db, AnyBulkWriteOperation } from "mongodb";

type Data = Record<string, any>;

export interface Storage {
  readonly name: string;
  load(): Promise<Data | null>;
  /** Records the latest state; may write asynchronously. */
  save(data: Data): void;
  /** Writes any pending changes (call before shutdown). */
  flush(): Promise<void>;
}

export class FileStorage implements Storage {
  readonly name: string;

  constructor(private filePath: string) {
    this.name = `file (${filePath})`;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  async load() {
    if (!fs.existsSync(this.filePath)) return null;
    return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
  }

  save(data: Data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to persist ZemaHub DB", error);
    }
  }

  async flush() {}
}

// Array fields stored one document per item, keyed by the given field.
const COLLECTIONS: Record<string, string> = {
  mezmurs: "id",
  films: "id",
  users: "id",
  sessions: "tokenHash",
  comments: "id"
};
// Everything else (catalogVersion, categories, singers, stats) lives in a single "meta" document.
const META_ID = "meta";

export class MongoStorage implements Storage {
  readonly name = "MongoDB";
  private db!: Db;
  private client: MongoClient;
  private latest: Data | null = null;
  private timer: NodeJS.Timeout | null = null;
  private flushing: Promise<void> | null = null;
  // JSON of each document as last written, so unchanged documents are skipped.
  private snapshots = new Map<string, Map<string, string>>();
  private metaSnapshot = "";

  constructor(uri: string, private dbName: string) {
    this.client = new MongoClient(uri);
  }

  async load() {
    await this.client.connect();
    this.db = this.client.db(this.dbName);

    const meta = await this.db.collection<Data>("meta").findOne({ _id: META_ID as any });
    if (!meta) return null;

    const { _id, ...metaFields } = meta;
    const data: Data = { ...metaFields };
    this.metaSnapshot = JSON.stringify(metaFields);

    for (const [name, key] of Object.entries(COLLECTIONS)) {
      const docs = await this.db.collection<Data>(name).find().toArray();
      const snapshot = new Map<string, string>();
      data[name] = docs.map(({ _id, ...doc }) => {
        snapshot.set(String(doc[key]), JSON.stringify(doc));
        return doc;
      });
      this.snapshots.set(name, snapshot);
    }
    return data;
  }

  save(data: Data) {
    this.latest = data;
    if (this.timer) return;
    // Batch bursts of changes (e.g. several saves in one request) into one write.
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush().catch((error) => console.error("Failed to persist ZemaHub DB to MongoDB", error));
    }, 250);
  }

  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    // Serialize flushes; a save that arrives mid-flush is picked up by the next one.
    while (this.flushing) await this.flushing;
    if (!this.latest) return;
    const data = this.latest;
    this.latest = null;
    this.flushing = this.write(data).finally(() => {
      this.flushing = null;
    });
    try {
      await this.flushing;
    } catch (error) {
      // Keep the unsaved state so the next save/flush retries it.
      this.latest = this.latest ?? data;
      throw error;
    }
  }

  private async write(data: Data) {
    const metaFields: Data = {};
    for (const [field, value] of Object.entries(data)) {
      if (!(field in COLLECTIONS)) metaFields[field] = value;
    }
    const metaJson = JSON.stringify(metaFields);
    if (metaJson !== this.metaSnapshot) {
      await this.db.collection<Data>("meta").replaceOne({ _id: META_ID as any }, metaFields, { upsert: true });
      this.metaSnapshot = metaJson;
    }

    for (const [name, key] of Object.entries(COLLECTIONS)) {
      const previous = this.snapshots.get(name) ?? new Map<string, string>();
      const current = new Map<string, string>();
      const ops: AnyBulkWriteOperation<Data>[] = [];

      for (const doc of (data[name] ?? []) as Data[]) {
        const id = String(doc[key]);
        const json = JSON.stringify(doc);
        current.set(id, json);
        if (previous.get(id) !== json) {
          ops.push({ replaceOne: { filter: { _id: id as any }, replacement: doc, upsert: true } });
        }
      }
      for (const id of previous.keys()) {
        if (!current.has(id)) ops.push({ deleteOne: { filter: { _id: id as any } } });
      }

      if (ops.length) await this.db.collection<Data>(name).bulkWrite(ops, { ordered: false });
      this.snapshots.set(name, current);
    }
  }
}

export function createStorage(): Storage {
  const uri = process.env.MONGODB_URI;
  if (uri) return new MongoStorage(uri, process.env.MONGODB_DB || "zemahub");
  return new FileStorage(process.env.DB_PATH || path.join(process.cwd(), "data", "zemahub_db.json"));
}
