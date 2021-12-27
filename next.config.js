module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com', "static-cdn.jtvnw.net"]
  },
  env: {
    HEADER_SECRET: process.env.HEADER_SECRET
  }
}
