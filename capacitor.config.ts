import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "net.jcrlabs.blog",
  appName: "JCRLabs Tech Blog",
  webDir: "out",
  server: {
    url: "https://tech-blog.jcrlabs.net",
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#050507",
    },
  },
}

export default config
