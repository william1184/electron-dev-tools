const path = require('path');
const { Tray } = require('electron');

/**
 * Encapsular Tray Icon e eventos que alteram seus estados
 */
class TrayIcon extends Tray {
    

    constructor({id, store, ipcMain }){
        super(path.resolve(__dirname, 'assets', 'iconTemplate.png'));

        /**
         * Quando receber pedido de atualizar o tray icon
         * @param estado (true = normal, false = erro)
         */
        ipcMain.on('update-tray', (estado = false) => {
            let icone = 'iconTemplateErro.png'
            if(estado){
                icone = 'iconTemplate.png';
            }
            this.setImage(icone);
        });

        ipcMain.on('show-ballon', (titulo, conteudo, tipoIcone = 'warning') => {
            this.displayBalloon(
                {
                    iconType: tipoIcone,
                    title:  titulo,
                    content: conteudo
                }
            );
        });
    }
}