import { app, BrowserWindow, ipcMain, screen } from "electron";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow = null;
let splashWindow = null;
let backendProcess = null;

const isDev = !app.isPackaged;

// -------------------- SINGLE INSTANCE --------------------
if (!app.requestSingleInstanceLock()) {
  console.log("❌ Another instance is running. Quitting...");
  app.quit();
}

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// -------------------- BACKEND --------------------
function startBackend() {
  if (backendProcess) return;

  const serverPath = isDev
    ? path.join(__dirname, "../server/index.js")
    : path.join(process.resourcesPath, "server/index.js");

  console.log("🚀 Starting backend:", serverPath);

  backendProcess = spawn("node", [serverPath], {
    cwd: path.dirname(serverPath),
    shell: false, // shell false rakho
    detached: true, // process independent
    windowsHide: true, // console hide
    stdio: "ignore", // console logs ignore
  });

  backendProcess.unref(); // detach completely

  backendProcess.on("error", (err) =>
    console.error("❌ Backend spawn error:", err)
  );

  backendProcess.on("close", (code) =>
    console.log("🛑 Backend exited with code:", code)
  );
}

// -------------------- WINDOWS --------------------
function createWindows() {
  if (mainWindow) return;

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  splashWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  splashWindow.loadFile(path.join(__dirname, "splash.html"));

  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    if (!splashWindow.isDestroyed())
      splashWindow.webContents.send("update-progress", progress);

    if (progress >= 100) {
      clearInterval(interval);

      mainWindow = new BrowserWindow({
        width,
        height,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
          contextIsolation: true,
          nodeIntegration: false,
        },
      });

      const frontendURL = isDev
        ? "http://localhost:5173"
        : `file://${path.join(
            process.resourcesPath,
            "client/dist/index.html"
          )}`;

      mainWindow.loadURL(frontendURL);

      mainWindow.webContents.once("did-finish-load", () => {
        if (!splashWindow.isDestroyed()) splashWindow.close();
        mainWindow.show();
      });
    }
  }, 100);
}

// -------------------- IPC --------------------
ipcMain.handle("print-to-pdf", async (event, invoiceNo) => {
  try {
    const win = BrowserWindow.getFocusedWindow();
    const pdfData = await win.webContents.printToPDF({ printBackground: true });
    const downloadsPath = app.getPath("downloads");
    const invoicesDir = path.join(downloadsPath, "invoices");
    if (!fs.existsSync(invoicesDir))
      fs.mkdirSync(invoicesDir, { recursive: true });

    const now = new Date();
    const fileName = `Invoice-${invoiceNo}-${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}.pdf`;
    const filePath = path.join(invoicesDir, fileName);
    fs.writeFileSync(filePath, pdfData);

    return { success: true, filePath };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
});

// -------------------- APP LIFECYCLE --------------------
app.whenReady().then(() => {
  startBackend();
  createWindows();
});

app.on("before-quit", () => {
  if (backendProcess) backendProcess.kill();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => createWindows());
