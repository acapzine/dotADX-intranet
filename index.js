const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const dns = require("node:dns/promises");

dns.setServers(["127.0.0.1:53"]);

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "icon.icns"),
  });

  win.maximize();

  win.loadFile(path.join(__dirname, "index.html"));

  ipcMain.on("search-query", async (event, query) => {
    console.log(`Received search query: ${query}`);

    const domain = query.replace(/^https?:\/\//, "");

    try {
      const aRecords = await dns.resolve(domain);
      const ipAddress = aRecords[0];

      let port = "80";
      try {
        const txtRecords = await dns.resolveTxt(`_port.${domain}`);
        port = txtRecords[0][0];
      } catch (err) {
        console.log("No custom port found, using default port 80.");
      }

      const urlToLoad = `http://${ipAddress}:${port}`;

      event.reply("search-result", urlToLoad);
    } catch (err) {
      console.error("DNS resolution failed:", err);
      event.reply("search-result", `DNS resolution failed for: ${query}`);
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
