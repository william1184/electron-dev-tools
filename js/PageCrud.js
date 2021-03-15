'use strict'

const { BrowserWindow } = require('electron')
const path = require('path');
const Datastore = require('./Datastore');

const configApp = new Datastore({name: 'app-store'});

// default window settings
const defaultProps = {
  width: 600,
  height: 600,
  show: false,
  
  // update for electron V5+
  webPreferences: {
    nodeIntegration: true
  }
}

/**
 * Cria uma página de crud
 */
class PageCrud extends BrowserWindow {

  constructor ({id, filePath, store, ipcMain, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })
    this.isSubpaginaOpen = false;
    // load the html and open devtools
    this.loadFile(`${filePath}/index.html`);
    // this.webContents.openDevTools();
    this.removeMenu();

    this.once('ready-to-show', () => {
      this.show()
    })

//   let addTodoWin

//   // TODO: put these events into their own file

//   // initialize with todos
    this.once('show', () => {
      this.webContents.send('store', store.dados)
    })

//   // create add todo window
    ipcMain.on(`add-${id}-window`, () => {
      // if addTodoWin does not already exist
      if (!this.isSubpaginaOpen) {
        // create a new add todo window
        
        this.subpagina = new PageCrud({
          filePath: path.join(filePath, '/add'),
          width: 600,
          height: 600,
          // close with the main window
          parent: this,
          modal: true,
          id: `${id}-add-page`,
          ipcMain: ipcMain, 
          store: store,
        })

        this.isSubpaginaOpen = true;

        // cleanup
        this.subpagina.on('closed', () => {
          this.subpagina = null;
          this.isSubpaginaOpen = false;
        })
      }
    })

    ipcMain.on(`add-${id}`, (event, dado) => {
      console.log(`add-${id}`);
      this.send('store', store.adicionar(dado).dados)
    })

    ipcMain.on(`update-${id}`, (event, dado) => {
      console.log(`update-${id}`);
      this.send('store', store.adicionar(dado).dados)
    })

    ipcMain.on(`delete-${id}`, (event, dado) => {
      console.log(`delete-${id}`);
      this.send('store', store.deletar(dado).dados)
    })


  }
}

module.exports = PageCrud