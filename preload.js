const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    selectApp: () => ipcRenderer.invoke('select-app'),
    saveApps: (apps) => ipcRenderer.invoke('save-apps', apps),
    loadApps: () => ipcRenderer.invoke('load-apps'),
    selectIcon: () => ipcRenderer.invoke('select-icon'),
});