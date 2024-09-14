const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  search: (query) => ipcRenderer.send("search-query", query),
  onResult: (callback) =>
    ipcRenderer.on("search-result", (event, result) => callback(result)),
});
