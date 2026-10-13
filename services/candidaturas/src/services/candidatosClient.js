const axios = require('axios');

const buscaCandidatoID = async (candidatoID) => {
    try{
        const resposta = await axios.get(
            `${process.env.CANDIDATOS_SERVICE_URL}/${candidatoID}`, //Busca na porta 3003
            {timeout: 3000}
        );
        return resposta.data;
    } catch (erro){
        //candidatos respondeu, mas candidato nao existe
        if (erro.response.status && [400,404].includes(erro.response.status)) {
            return null
        }

        //fora do ar, timeout, eroo 500 do outro lado
        const falha = new Error ('Serviço de candidatos indisponível');
        falha.code = 'CANDIDATOS_INDISPONIVEL';
        throw falha;
    }
}

module.exports = {buscaCandidatoID}