import { app, BrowserWindow, ipcMain } from "electron";

ipcMain.on("window-minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on("window-maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on("window-close", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 500,
    minHeight: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#1c685c",
      symbolColor: "#ffffff",
      height: 32,
    },
    backgroundColor: "#1c685c",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});
