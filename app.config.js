import "dotenv/config";

export default {
  expo: {
    owner: "des-pensa",
    name: "des-pensa",
    slug: "des-pensa",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/flame.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#F57C00",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "2d14742c-ed24-428d-bf17-28128acbd7ff",
      },
    },
    android: {
      package: "com.seuapp", // Substitua com o pacote correto do seu app
    },
    updates: {
      url: "https://u.expo.dev/2d14742c-ed24-428d-bf17-28128acbd7ff",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
