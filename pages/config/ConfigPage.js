const PageCrud = require("../../js/PageCrud");
const path = require('path');
const configStore = new Datastore({name: 'app-store'});


class ConfigPage extends PageCrud {

    constructor({ ipcMain }) {
        super({     id: 'config-page'
                  , filePath: path.resolve(__dirname, 'pages/config')
                  , ipcMain: ipcMain
                  , store: configStore    });
    }
}


module.exports = ConfigPage;