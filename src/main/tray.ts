//
// Created by yslim on 2017. 12. 31.
//

import { BrowserWindow, Tray } from 'electron';
const path = require('path')

const assetsDirectory = path.join(__dirname, 'assets', "images")

let tray: Tray = undefined;
let mainWindow: BrowserWindow = undefined;

function createTray ()
{
   mainWindow = createMainWindow();
   tray = new Tray(path.join(assetsDirectory, 'i0.png'));
   tray.on('right-click', toggleWindow)
   tray.on('double-click', toggleWindow)
   tray.on('click', toggleWindow);
}

// never used on tray only app
function createMainWindow ()
{
   // Create the browser window.
   const window = new BrowserWindow({
      width: 500,
      height: 300,
      show: false,
      frame: false,
      fullscreenable: false,
      resizable: false,
      webPreferences: {
         // Prevents renderer process code from not running when window is
         // hidden
         backgroundThrottling: false
      }
   });

   const url = `file://${__dirname}/index.html`;

   // if (isDev) {
   //    window.webContents.openDevTools();
   // }

   window.loadURL(url);

   // Hide the window when it loses focus
   window.on('blur', () =>
   {
      if (!window.webContents.isDevToolsOpened())
      {
         window.hide()
      }
   })

   return window;
}

function toggleWindow ()
{
   if (mainWindow.isVisible())
   {
      mainWindow.hide();
   } else
   {
      showWindow();
   }
}

function showWindow ()
{
   const position = getWindowPostion();
   mainWindow.setPosition(position.x, position.y, false);
   mainWindow.show();
   mainWindow.focus();
}

function getWindowPostion ()
{
   const windowBounds = mainWindow.getBounds();
   const trayBounds = tray.getBounds();

   // Center window horizontally below the tray icon
   const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

   // Position window 4 pixels vertically below the tray icon
   const y = Math.round(trayBounds.y + trayBounds.height + 4)

   return { x: x, y: y }
}

export { createTray, createMainWindow };

