module.exports = {
  env: {
    GOONG_API_KEY: process.env.GOONG_API_KEY,
    GOONG_MAP_KEY: process.env.GOONG_MAP_KEY,
  },
  images: {
    domains: ["127.0.0.1"],
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
  typescript: {
    ignoreBuildErrors: true,
  },
};
