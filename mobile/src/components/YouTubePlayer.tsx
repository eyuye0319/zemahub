import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { API_URL } from '../lib/api';

// The official YouTube embed, loaded with the ZemaHub site as its origin: YouTube rejects embeds
// that don't identify the page they're shown on.
function embedHtml(videoId: string) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1&autoplay=1&origin=${encodeURIComponent(API_URL)}`;
  return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}iframe{border:0;width:100%;height:100%}</style>
</head><body>
<iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
</body></html>`;
}

export default function YouTubePlayer({ videoId }: { videoId: string }) {
  return (
    <View style={styles.frame}>
      <WebView
        key={videoId}
        source={{ html: embedHtml(videoId), baseUrl: API_URL }}
        style={styles.webview}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={(req) => {
          const isPlayer =
            req.url.startsWith('about:') ||
            req.url.startsWith(API_URL) ||
            req.url.includes('/embed/') ||
            !req.isTopFrame;
          if (isPlayer) return true;
          // Taps on the YouTube logo/title etc. open the YouTube app instead of replacing the player.
          Linking.openURL(req.url).catch(() => {});
          return false;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  webview: { flex: 1, backgroundColor: '#000' }
});
