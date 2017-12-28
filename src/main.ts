//
// Created by yslim on 2017. 12. 25..
//

import {
   app, BrowserWindow, Menu, shell, Tray,
   MenuItemConstructorOptions, App, Shell
} from 'electron';

// import * as electron_reload from 'electron-reload';

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow, isDev;

const args = process.argv.slice (1);
isDev = args.some (val => val === '--serve');

// if (isDev)
// {
//    require ('electron-reload') (__dirname, {});
// }

function createMainWindow ()
{
   // Create the browser window.
   const window = new BrowserWindow ({
      width: 800,
      height: 600
   });

   const url = `file://${__dirname}/index.html`;

   // if (isDev) {
   //    window.webContents.openDevTools();
   // }

   window.loadURL (url);

   // Emitted when the window is closed.
   window.on ('closed', () =>
   {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
   });

   return window;
}

function buildApplicationMenu ()
{
   const menu = menuTemplate (app, shell);
   Menu.setApplicationMenu (Menu.buildFromTemplate (menu));
}

let appIcon;

// This method will be called when Electron has finished
function createTray ()
{
   const platform = require ('os').platform ();
   const imageFolder = __dirname + '/assets/images';
   let trayImage;

   // // Determine appropriate icon for platform
   if (platform == 'darwin')
   {
      trayImage = imageFolder + '/i5+.png';
   }
   else if (platform == 'win32')
   {
      trayImage = imageFolder + '/win/tray.ico';
   }

   appIcon = new Tray (trayImage);
   let image = require ('electron').nativeImage.createFromPath (trayImage);
   image.setTemplateImage (true);

   if (platform == "darwin")
   {
      appIcon.setPressedImage (image);
   }
}

// initialization and is ready to create browser windows.
function appReady ()
{
   // only for menubar app
   // don't call createMainWindow
   createMainWindow ();
   buildApplicationMenu ();
   // createTray ();
}

// Some APIs can only be used after this event occurs.
app.on ('ready', appReady);


// Quit when all windows are closed.
app.on ('window-all-closed', () =>
{
   // On macOS it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if (process.platform !== 'darwin')
   {
      app.quit ();
   }
});

app.on ('activate', () =>
{
   // On macOS it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (mainWindow === null)
   {
      mainWindow = createMainWindow ();
   }
});

//
// refer to https://www.npmjs.com/package/electron-default-menu for macOS menu
//
function menuTemplate (app: App, shell: Shell)
{

   // noinspection TypeScriptValidateTypes
   const template: MenuItemConstructorOptions[] = [
      {
         label: 'Edit',
         submenu: [
            {
               label: 'Undo',
               accelerator: 'CmdOrCtrl+Z',
               role: 'undo'
            },
            {
               label: 'Redo',
               accelerator: 'Shift+CmdOrCtrl+Z',
               role: 'redo'
            },
            {
               type: 'separator',
            },
            {
               label: 'Cut',
               accelerator: 'CmdOrCtrl+X',
               role: 'cut'
            },
            {
               label: 'Copy',
               accelerator: 'CmdOrCtrl+C',
               role: 'copy'
            },
            {
               label: 'Paste',
               accelerator: 'CmdOrCtrl+V',
               role: 'paste'
            },
            {
               label: 'Select All',
               accelerator: 'CmdOrCtrl+A',
               role: 'selectall'
            },
         ]
      },
      {
         label: 'View',
         submenu: [
            {
               label: 'Reload',
               accelerator: 'CmdOrCtrl+R',
               click: function (item, focusedWindow)
               {
                  if (focusedWindow)
                     focusedWindow.reload ();
               }
            },
            {
               label: 'Toggle Full Screen',
               accelerator: (function ()
               {
                  if (process.platform === 'darwin')
                     return 'Ctrl+Command+F';
                  else
                     return 'F11';
               }) (),
               click: function (item, focusedWindow)
               {
                  if (focusedWindow)
                     focusedWindow.setFullScreen (!focusedWindow.isFullScreen ());
               }
            },
            {
               label: 'Toggle Developer Tools',
               accelerator: (function ()
               {
                  if (process.platform === 'darwin')
                     return 'Alt+Command+I';
                  else
                     return 'Ctrl+Shift+I';
               }) (),
               click: function (item, focusedWindow)
               {
                  if (focusedWindow)
                     focusedWindow.webContents.toggleDevTools ();
               }
            },
         ]
      },
      {
         label: 'Window',
         role: 'window',
         submenu: [
            {
               label: 'Minimize',
               accelerator: 'CmdOrCtrl+M',
               role: 'minimize'
            },
            {
               label: 'Close',
               accelerator: 'CmdOrCtrl+W',
               role: 'close'
            },
         ]
      },
      {
         label: 'Help',
         role: 'help',
         submenu: [
            {
               label: 'Learn More',
               click: function ()
               {
                  shell.openExternal ('http://electron.atom.io');
               }
            },
         ]
      },
   ];

   if (process.platform === 'darwin')
   {
      let name: string = app.getName ();

      template.unshift ({
         label: name,
         submenu: [
            {
               label: 'About ' + name,
               role: 'about'
            },
            {
               label: '',
               type: 'separator',
               role: '',
            },
            {
               label: 'Services',
               role: 'services',
               submenu: []
            },
            {
               type: 'separator'
            },
            {
               label: 'Hide ' + name,
               accelerator: 'Command+H',
               role: 'hide'
            },
            {
               label: 'Hide Others',
               accelerator: 'Command+Shift+H',
               role: 'hideothers'
            },
            {
               label: 'Show All',
               role: 'unhide'
            },
            {
               type: 'separator'
            },
            {
               label: 'Quit',
               accelerator: 'Command+Q',
               click: function ()
               {
                  app.quit ();
               }
            },
         ]
      });

      // const windowMenu = template.find (function (m)
      // {
      //   return m.role === 'window'
      // });
      const windowMenu = template.filter ((m) =>
      {
         return m.role === 'window';
      })[ 0 ];
      if (windowMenu && windowMenu.submenu instanceof Array)
      {
         windowMenu.submenu.push (
            {
               type: 'separator'
            },
            {
               label: 'Bring All to Front',
               role: 'front'
            }
         );
      }
   }

   return template;
}
