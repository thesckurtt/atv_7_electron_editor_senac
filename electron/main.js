import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = undefined

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  // mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null)
  mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);

ipcMain.handle('open-file', async () => {
  // console.log('Abrindo diálogo de arquivo...');
  try {
    const result = await dialog.showOpenDialog({
      title: 'Selecione um arquivo JSON',
      defaultPath: app.getPath('downloads'),
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
      properties: ['openFile'],
    });

    if (result.canceled) return { cancelado: true };
    const filePath = result.filePaths[0];
    const fileName = path.basename(filePath)
    const content = await fs.readFile(filePath, 'utf-8');

    return { content, fileName };
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('save-file', async (event, data) => {
  try {
    const result = await dialog.showSaveDialog({
      title: 'Salvar arquivo JSON',
      defaultPath: path.join(app.getPath('downloads'), data.fileName || 'new.json'),
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
    });

    if (result.canceled) return { cancelado: true };

    const filePath = result.filePath;
    await fs.writeFile(filePath, data.content, 'utf-8');

    return { sucesso: true, filePath };
  } catch (error) {
    return { error: error.message };
  }
});

// ipcMain.handle('save-file', async (event, data) => {
//   console.log(data)
// })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
