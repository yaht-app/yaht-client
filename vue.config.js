module.exports = {
  configureWebpack: {
    target: 'electron-renderer',
  },
  pluginOptions: {
    electronBuilder: {
      nodeintegration: true,
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
