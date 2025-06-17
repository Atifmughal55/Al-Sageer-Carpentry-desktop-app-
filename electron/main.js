import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173"); // Or your React build path
}

// Save invoice PDF to Downloads/invoices/
ipcMain.handle("print-to-pdf", async (event, invoiceNo) => {
  try {
    const win = BrowserWindow.getFocusedWindow();

    const pdfData = await win.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      marginsType: 1,
    });

    const downloadsPath = app.getPath("downloads");
    const invoicesDir = path.join(downloadsPath, "invoices");
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    const fileName = `Invoice-${invoiceNo}-${formattedDate}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    fs.writeFileSync(filePath, pdfData);

    return { success: true, filePath };
  } catch (error) {
    console.error("Failed to save PDF:", error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createWindow);
