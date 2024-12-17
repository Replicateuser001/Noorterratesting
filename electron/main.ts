import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { 
  saveTestResults, 
  getTestResults, 
  syncLocalTestResults,
  saveUser,
  getUser,
  getAllUsers,
  syncUsers
} from '../src/lib/db'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Initial sync of users when app starts
  syncUsers()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle user management
ipcMain.handle('save-user', async (_, user) => {
  return saveUser(user)
})

ipcMain.handle('get-user', async (_, username) => {
  return getUser(username)
})

ipcMain.handle('get-all-users', async () => {
  return getAllUsers()
})

ipcMain.handle('sync-users', async () => {
  return syncUsers()
})

// Handle test results
ipcMain.handle('save-test-results', async (_, results) => {
  return saveTestResults(results)
})

ipcMain.handle('get-test-results', async (_, username) => {
  return getTestResults(username)
})

ipcMain.handle('sync-test-results', async (_, username) => {
  return syncLocalTestResults(username)
})
