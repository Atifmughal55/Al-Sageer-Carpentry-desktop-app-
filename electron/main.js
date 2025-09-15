import { app, BrowserWindow, screen } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let splashWindow;

// ✅ Icon path helper
function getIconPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "assets", "icons", "al-sageer.ico")
    : path.join(__dirname, "assets/icons/al-sageer.ico");
}

// ✅ Start backend server
function startServer() {
  const serverPath = app.isPackaged
    ? path.join(process.resourcesPath, "server", "index.js") // exe mode
    : path.join(__dirname, "../server/index.js"); // dev mode

  console.log("Server path:", serverPath);

  return new Promise((resolve, reject) => {
    try {
      const server = spawn("node", [serverPath]); // 🚀 FIXED: no detached, no stdio
      server.on("error", (err) => reject(err));

      // wait a bit to ensure server starts
      setTimeout(() => resolve(), 2000);
    } catch (err) {
      console.error("Server failed to start:", err);
      reject(err);
    }
  });
}

// ✅ Create splash + main window
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  splashWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  splashWindow.loadFile(path.join(__dirname, "splash.html"));

  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    splashWindow.webContents.send("update-progress", progress);

    if (progress >= 100) {
      clearInterval(interval);

      mainWindow = new BrowserWindow({
        width,
        height,
        show: false,
        icon: getIconPath(),
        autoHideMenuBar: true,
        webPreferences: {
          preload: path.join(__dirname, "preload.js"),
          contextIsolation: true,
          nodeIntegration: false,
        },
      });

      // ✅ Frontend URL
      const frontendURL = app.isPackaged
        ? `file://${path.join(
            process.resourcesPath,
            "client",
            "dist",
            "index.html"
          )}`
        : "http://localhost:5173";

      console.log("Loading frontend from:", frontendURL);
      mainWindow.loadURL(frontendURL);

      mainWindow.webContents.once("did-finish-load", () => {
        splashWindow.close();
        mainWindow.show();
      });
    }
  }, 100); // ~2 seconds
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
