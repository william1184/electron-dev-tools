const Store = require('electron-store');


class Datastore extends Store {

    constructor(settings){
        super(settings);
        this.name = `${settings.name}-db`;
        this.dados = this.get(this.name) || [];
        this.dado = this.dados[0] || {};
        console.log(this.dados);
    }

    salvar(){
        this.set(this.name, this.dados);
        return this;
    }

    buscar(id){
        // set object's todos to todos in JSON file
       this.dados = this.get(this.name) || []

       return this.dados.filter( itemLoop => itemLoop.id === id);;
    }

    buscarTodos(){
         // set object's todos to todos in JSON file
        this.dados = this.get(this.name) || []

        return this;
    }

    adicionar(dado){

        let dadoDB = this.buscar(dado.id);

        if(dadoDB) return this.buscarTodos();

        this.dados = [...this.dados, JSON.parse(dado)];
        return this.salvar();
    }

    
    alterar(dado){
        let dadoAtualizado = JSON.parse(dado);
        
        this.dados = this.dados.filter( itemLoop => itemLoop.id !== dadoAtualizado.id);

        return this.adicionar(dadoAtualizado);
    }

    deletar(dado){
        dado = JSON.parse(dado);
        this.dados = this.dados.filter( itemLoop => itemLoop.id !== dado.id);
        console.log(this.dados);
        return this.salvar();
    }
    
}

module.exports = Datastore;