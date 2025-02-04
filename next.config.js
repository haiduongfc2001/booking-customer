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
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  publicRuntimeConfig: {
    backendUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
