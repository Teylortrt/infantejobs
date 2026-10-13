const axios = require('axios');

const buscarVagaPorId = async (vagaID) => {
    try{
        const resposta = await axios.get(
            `${process.env.VAGAS_SERVICE_URL}/${vagaID}`, //http://localhost3002/vagas/;id
            { timeout: 3000} // não deixa vagas travado esperando empresas
        );
        return resposta.data;
    } catch (erro) {
        // vaga respondeu, mas a vaga não existe
        if (erro.response && [400,404].includes(erro.response.status)) {
            return null;
        }

        //fora do ar, timeout, erro 500 de outro lado
        const falha = new Error ('Serviço de vagas indisponível');
        falha.code = 'VAGAS_INDISPONIVEL';
        throw falha;
    }
}

module.exports = {buscarVagaPorId}