'use strict'

const { ipcRenderer } = require('electron');
const ID_PAGE = 'config-page';

// const dados = {username: "sgdfgdfg", password: "dfgfdg", url: "gdfgdf"};

// // on receive cruds
ipcRenderer.on(`store`, (event, dados) => {
      console.log(dados);
      if(dados){
        console.log(dados[0]);
        for (const key in dados[0]) {
          if (Object.hasOwnProperty.call(dados[0], key)) {

            let elemento = document.querySelector(`form [name="${key}"]`);
            console.log({elemento}); console.log(dados[0][key]);

            if(elemento && dados[0][key]){
              elemento.value = dados[0][key];
            }
            
          }
        }
      }
});

const serializeForm = function (form) {
	let obj = {};
	let formData = new FormData(form);
	for (let key of formData.keys()) {
		obj[key] = formData.get(key);
	}
	return obj;
};

document.getElementById('config-form').addEventListener('submit', (evt) => {
  evt.preventDefault()

  ipcRenderer.send(`add-${ID_PAGE}`, JSON.stringify(serializeForm(evt.target)));

})