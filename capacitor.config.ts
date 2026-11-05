import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "eg.familyhealth.app",
  appName: "Family Health",
  webDir: "out",
  server: {
    androidScheme: "https",
    // For live development reload, uncomment the local server url:
    // url: "http://192.168.1.x:3000",
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#156570",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#156570",
    },
  },
};

export default config;
