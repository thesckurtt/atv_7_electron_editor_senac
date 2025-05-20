import { contextBridge, ipcRenderer } from 'electron'

contextBridge.executeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data)
})