module.exports = {
  configureWebpack: {
    target: 'electron-renderer',
    entry: {
      app: './src/renderer/ui/app.ts',
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeintegration: true,
      mainProcessFile: 'src/main/background.ts',
      builderOptions: {
        mac: {
          extendInfo: {
            NSUserNotificationAlertStyle: 'alert',
          },
        },
      },
    },
  },
};
