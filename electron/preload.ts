import { contextBridge, ipcRenderer } from 'electron'
import type { TestResults } from '../src/lib/gemini'

// Expose database operations to the renderer process
contextBridge.exposeInMainWorld('database', {
  // User management
  saveUser: (user: { username: string; displayName: string; password: string }) => 
    ipcRenderer.invoke('save-user', user),
  getUser: (username: string) => 
    ipcRenderer.invoke('get-user', username),
  getAllUsers: () => 
    ipcRenderer.invoke('get-all-users'),
  syncUsers: () => 
    ipcRenderer.invoke('sync-users'),

  // Test results management
  saveTestResults: (results: TestResults) => 
    ipcRenderer.invoke('save-test-results', results),
  getTestResults: (username: string) => 
    ipcRenderer.invoke('get-test-results', username),
  syncLocalTestResults: (username: string) => 
    ipcRenderer.invoke('sync-test-results', username)
})
