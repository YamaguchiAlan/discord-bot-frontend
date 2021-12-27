module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com', "static-cdn.jtvnw.net"]
  },
  env: {
    NEXT_PUBLIC_HEADER_SECRET: process.env.NEXT_PUBLIC_HEADER_SECRET
  }
}
