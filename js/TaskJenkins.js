'use strict'
const axios = require('axios');
const Datastore = require('./Datastore');
const { Notification } = require('electron')

const jenkinsJobs = new Datastore({name: 'jenkins-store'});
const configApp = new Datastore({name: 'app-store'});

const TEMPO_TASK_1_MINUTO = 60000;

class TaskJenkins {

    constructor(){
        console.log(jenkinsJobs.dados);
        console.log(configApp.dado);

        this.username = configApp.dado.username;
        this.password = configApp.dado.password;
        this.url = ( configApp.dado.url );
        this.tempo = TEMPO_TASK_1_MINUTO;
        this.token = Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');
        this.ambientes = jenkinsJobs.dados.map( (job) => job.id );
        console.log(this.ambientes);
        
    }
        
    rodarTask() {
        console.log("task Iniciada");
            for(let ambiente of this.ambientes){
                console.log("VERIFICANDO AMBIENTE: " + ambiente);
                //TODO remover comentario
                // executarChamadaApi(ambiente);		
            }
    }    

    rodarTaskIntervaloDeTempo() {
        setInterval(() => {
            rodarTask()
        }, this.tempo);
    }

    executarChamadaApi(ambiente) {
        axios(`${this.url}/jenkins/job/${ambiente}/api/json?pretty=true`, {
            headers: {
                'Authorization': `Basic ${this.token}`
                }
        }).then( function(response){
            if(response){
                let dados = typeof response.data === "object" ? response.data : JSON.parse(response.data);
                if(dados){
                    let dadoArmazenado = jenkinsJobs.buscar(ambiente);
                    let ultimoBuild = dados.lastBuild.number;
                    let buildQuebrado = dados.lastFailedBuild.number;
                    let isUltimoBuildQuebrado = dadoArmazenado.ultimoBuild === buildQuebrado || ( ultimoBuild - buildQuebrado <= 2 );

                    if( dadoArmazenado.ultimoBuild === ultimoBuild )
                        return;

                    jenkinsJobs.alterar({...dadoArmazenado, url: configApp.dado.url, ultimoBuild: ultimoBuild, falha: isUltimoBuildQuebrado });
                }
                
            }
        });
    }

    enviarNotificacao(build = 0, ambiente = 'ambiente-mock') {
        const notification = { title: 'Aviso do jenkins',  body: ` O Build ${build} do ${ambiente} falhou`, timeoutType: 'never' };
        new Notification(notification).show()
    }

}

module.exports = TaskJenkins;