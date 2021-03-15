'use strict'

const { ipcRenderer } = require('electron');
const { ID_PAGINA_JENKINS_KEY } = require('../../utils/pages');

// delete crud by its text value ( used below in event listener)
const deletarItem = (e) => {
  ipcRenderer.send(`delete-${ID_PAGINA_JENKINS_KEY}`, JSON.stringify({ id: e.target.dataset.id}));
  ipcRenderer.send('update-menu', 'teste');
}

// create add crud window button
document.getElementById('createCrudBtn').addEventListener('click', () => {
  ipcRenderer.send(`add-${ID_PAGINA_JENKINS_KEY}-window`)
})

// on receive crud
ipcRenderer.on(`store`, (event, dados) => {

  // get the crudList ul
  const crudList = document.getElementById('crudList')
  console.log(dados);;
  // create html string
  const crudItems = dados.reduce((html, crudItem) => {
    html += `<li  data-id="${crudItem.id}" class="list-group-item d-flex justify-content-between align-items-center crud-item">${crudItem.conteudo} <span class="badge bg-${crudItem.falha ? 'danger' : 'success'} rounded-pill">build: ${crudItem.ultimoBuild}</span> <span class="badge bg-${crudItem.falha ? 'danger' : 'success'} rounded-pill">${crudItem.falha ? 'Falhou' : 'Normal'}</span></li>`

    return html
  }, '')

  // set list html to the crud items
  crudList.innerHTML = crudItems || '<li class="list-group-item d-flex justify-content-between align-items-center">NENHUM JOB CADASTRADO</li>';

  // add click handlers to delete the clicked crud
  crudList.querySelectorAll('.crud-item').forEach(item => {
    item.addEventListener('click', deletarItem)
  })
})