'use strict'

const { ipcRenderer } = require('electron')
const pages = require('../../../utils/pages')
const JobJenkins = require('../../../js/Entity/JobJenkins')

document.getElementById('crudForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()
  
  // input on the form
  const input = evt.target[0]
  
  if(input.value && input.value.trim()){
    // send crud to main process
    ipcRenderer.send(`add-${pages.ID_PAGINA_JENKINS_KEY}`, JSON.stringify( new JobJenkins({ id: input.value.trim(), conteudo: input.value.trim(), falha: false, ultimoBuild: 9999 })));
    ipcRenderer.send('update-menu', 'teste');
    // reset input
    input.value = ''
  }


})