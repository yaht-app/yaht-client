module.exports = {
  pluginOptions: {
    electronBuilder: {
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
