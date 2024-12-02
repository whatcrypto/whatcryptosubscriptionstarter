/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname),
      }
      return config
    },
    postcss: {
      config: './config/postcss.config.js'
    }
  }
  
  module.exports = nextConfig 