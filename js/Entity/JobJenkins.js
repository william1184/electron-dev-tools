

/**
 * Representa um jbbJenkins
 */
class JobJenkins {

    constructor({ id, conteudo, falha = false, ultimoBuild = 0}){
        this.id = id;
        this.conteudo = conteudo;
        this.falha = falha;
        this.ultimoBuild = ultimoBuild;
        this.url = '';
    }

    link(url) {
        `${url}/jenkins/job/${this.id}`;
    }

}

module.exports = JobJenkins;