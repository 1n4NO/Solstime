const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('solstimeDesktop', {
  platform: process.platform,
  surface: 'mac-widget',
});
