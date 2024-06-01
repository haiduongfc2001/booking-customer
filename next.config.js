module.exports = {
  env: {
    GOONG_API_KEY: process.env.GOONG_API_KEY,
    GOONG_MAP_KEY: process.env.GOONG_MAP_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  publicRuntimeConfig: {
    backendUrl: process.env.NEXT_PUBLIC_API_URL,
  },
};
