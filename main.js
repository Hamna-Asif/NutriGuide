const { app, BrowserWindow } = require('electron');
const path = require('path');
app.on('browser-window-focus',()=>{
  //focus on window
  BrowserWindow.fromId(1).webContents.focus();
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,  // Standard Windows desktop app width
    height: 720,  // Standard Windows desktop app height
    resizable: true,  // Allow users to resize the window
    minWidth: 1024,   // Set a minimum width
    minHeight: 600,   // Set a minimum height
  });

  // Load the HTML file into the window
  win.loadFile('startingpage.html');

  // Optionally maximize the window on launch
  // win.maximize();   // Uncomment if you want the window to start maximized

  // Optionally start in full-screen mode
  // win.setFullScreen(true);  // Uncomment if you want to start full-screen
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
