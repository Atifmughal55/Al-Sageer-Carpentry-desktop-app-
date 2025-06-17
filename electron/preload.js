import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  printToPDF: (invoiceNo) => ipcRenderer.invoke("print-to-pdf", invoiceNo),
});
