const path = require('path');
const { app, Menu, Tray, dialog, ipcMain } = require('electron');

const { spawn } = require('child_process');
const fixPath = require('fix-path');
const fs = require('fs');
const TaskJenkins = require('./js/TaskJenkins');
const Datastore = require('./js/Datastore');
const PageCrud = require('./js/PageCrud');

const jobsStore = new Datastore({name: 'jenkins-store'});
const configStore = new Datastore({name: 'app-store'});
const jenkins = new TaskJenkins();

let jobsSalvos = [];
fixPath();

let mainTray = {};

if (app.dock) {
  app.dock.hide();
}

ipcMain.on('update-menu', (msg)=>{
    console.log(msg);
    render(mainTray);
});

function montarItemMenuJobsSalvos(){
  console.log(jobsStore.dados.length)
  app.setBadgeCount(jobsStore.dados.length);
  if(jobsStore.dados.length > 0){
    
    jobsSalvos = jobsStore.dados.map((job)=>{
      return { label: `${ job.id } ${job.falha ? '<com falha>': '<normal>'}`, sublabel: `build: ${job.ultimoBuild }`, click: () => { } }
    });

    jobsSalvos.push( {    type: 'separator'  });

  }

}

function render(tray = mainTray) {
  montarItemMenuJobsSalvos();
  const contextMenu = Menu.buildFromTemplate([
        {
          label: "JOBS JENKINS",
          submenu: [
            ...jobsSalvos,
            {
              label: "Configurar",
              click: () => { new PageCrud({id: 'jenkins-page', filePath: path.resolve(__dirname, 'pages/jenkins'), ipcMain: ipcMain, store: jobsStore }); }
            },
          ]
        },
        {
          
          label: "Configurações",
          click: () => {
            new PageCrud({id: 'config-page', filePath: path.resolve(__dirname, 'pages/config'), ipcMain: ipcMain, store: configStore });
          }
        },
  //   {
  //     label: locale.add,
  //     click: () => {
  //       dialog.showOpenDialog({ properties: ['openDirectory'] }).then(function(res){
          
  //         if (!res.filePaths.length) return;
        
  //         const [path] = res.filePaths;
  //         const name = basename(path);
  
  //         store.set(
  //           'projects',
  //           JSON.stringify([
  //             ...projects,
  //             {
  //               path,
  //               name,
  //             },
  //           ]),
  //         );
  
  //         render();

  //       });
        
  //     },
  //   },
  //   {
  //     type: 'separator',
  //   },
  //   ...items,
    {
      type: 'separator',
    },
    {
      type: 'normal',
      label: 'fechar',
      role: 'quit',
      enabled: true,
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', tray.popUpContextMenu);
}

app.on('ready', () => {
  mainTray = new Tray(path.resolve(__dirname, 'assets', 'iconTemplate.png'));
  mainTray.setToolTip('Age-tools');
  jenkins.enviarNotificacao();
  render(mainTray);
  
});

app.on('window-all-closed', () => {
  if (app.dock) {
    app.dock.hide();
  }
})

