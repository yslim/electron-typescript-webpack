//
// Created by yslim on 2017. 12. 25..
//

import { app, BrowserWindow, Menu, shell, Tray } from 'electron';
import { menuTemplate } from './menu';
import { createTray } from './tray';

// import * as electron_reload from 'electron-reload';

let isDev;

const args = process.argv.slice(1);
isDev = args.some(val => val === '--serve');

// if (isDev)
// {
//    require ('electron-reload') (__dirname, {});
// }

app.dock.hide();

function buildApplicationMenu ()
{
   const menu = menuTemplate(app, shell);
   Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

// initialization and is ready to create browser windows.
function appReady ()
{
   buildApplicationMenu();
   createTray();
}

// Some APIs can only be used after this event occurs.
app.on('ready', appReady);

// Quit when all windows are closed.
app.on('window-all-closed', () =>
{
   app.quit();
});
