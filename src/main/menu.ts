//
// Created by yslim on 2017. 12. 24..
//
import { MenuItemConstructorOptions, App, Shell } from 'electron';

//
// refer to https://www.npmjs.com/package/electron-default-menu for macOS menu
//
export function menuTemplate (app: App, shell: Shell)
{

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
               type: 'separator'
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
                     focusedWindow.reload();
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
               })(),
               click: function (item, focusedWindow)
               {
                  if (focusedWindow)
                     focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
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
               })(),
               click: function (item, focusedWindow)
               {
                  if (focusedWindow)
                     focusedWindow.webContents.toggleDevTools();
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
                  shell.openExternal('http://electron.atom.io')
               }
            },
         ]
      },
   ];

   if (process.platform === 'darwin')
   {
      let name: string = app.getName()
         .split('-').map((part) =>
         {
            return part.charAt(0).toUpperCase() + part.slice(1);
         }).join('');

      template.unshift({
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
                  app.quit();
               }
            },
         ]
      });

      // const windowMenu = template.find (function (m)
      // {
      //   return m.role === 'window'
      // });
      const windowMenu = template.filter((m) =>
      {
         return m.role === 'window';
      })[0];
      if (windowMenu && windowMenu.submenu instanceof Array)
      {
         windowMenu.submenu.push(
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
