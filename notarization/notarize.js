/* eslint-disable @typescript-eslint/no-var-requires */
const {
  APPLE_ID,
  APP_BUNDLE_ID,
  APPLE_PASSWORD,
} = require('./notarize.config');
const { notarize } = require('electron-notarize');

module.exports = async (context) => {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    console.warn('Not running notarize. Platform is not macOS.');
    return;
  }
  if (!APPLE_ID) {
    console.warn('Not running notarize. APPLE_ID is missing in environment.');
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: APP_BUNDLE_ID,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: APPLE_ID,
    appleIdPassword: APPLE_PASSWORD,
  });
};
