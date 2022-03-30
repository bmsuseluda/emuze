import { ipcRenderer } from "electron";

window.addEventListener("message", async (event) => {
  if (event.data.type === "window") {
    ipcRenderer.send("window", event.data.name);
  }
});
