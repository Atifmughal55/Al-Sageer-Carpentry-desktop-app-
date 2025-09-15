const { contextBridge, ipcRenderer } = require("electron");
const Store = require("electron-store");

// Initialize secure persistent store
const store = new Store();

// Expose print functionality to renderer
contextBridge.exposeInMainWorld("electron", {
  printToPDF: (invoiceNo) => ipcRenderer.invoke("print-to-pdf", invoiceNo),
});

// Expose session store functionality to renderer
contextBridge.exposeInMainWorld("sessionStore", {
  setUser: (user) => store.set("user", user),
  getUser: () => store.get("user"),
  clearUser: () => store.delete("user"),
});
