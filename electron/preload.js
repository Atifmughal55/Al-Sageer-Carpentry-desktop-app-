const { contextBridge, ipcRenderer } = require("electron");

// PDF printing
contextBridge.exposeInMainWorld("electron", {
  printToPDF: (invoiceNo) => ipcRenderer.invoke("print-to-pdf", invoiceNo),
});

// Session storage
contextBridge.exposeInMainWorld("sessionStore", {
  setUser: (user) => ipcRenderer.invoke("session-store", "set", "user", user),
  getUser: () => ipcRenderer.invoke("session-store", "get", "user"),
  clearUser: () => ipcRenderer.invoke("session-store", "delete", "user"),
});
