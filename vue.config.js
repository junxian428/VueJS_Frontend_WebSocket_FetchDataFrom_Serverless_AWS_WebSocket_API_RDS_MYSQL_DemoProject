const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/production': {
        target: 'wss://32zhhpmuta.execute-api.us-east-1.amazonaws.com', // Your API server
        changeOrigin: true,
      },
    },
  },
  transpileDependencies: true
})
