import { Redirect, useLocalSearchParams } from 'expo-router';

// Opened from shared website links (https://…/watch/mezmur/<id>) via Android App Links.
export default function WatchLink() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  return <Redirect href={{ pathname: '/media/[type]/[id]', params: { type, id } }} />;
}
