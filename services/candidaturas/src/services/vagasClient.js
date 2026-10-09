const axios = require('axios');

const buscarEmpresaPorId = async (empresaId) => {
    try{
        const resposta = await axios.get(
            `${process.env.EMPRESAS_SERVICE_URL}/${empresaId}`, //http://localhost3001/empresas/;id
            { timeout: 3000} // não deixa vagas travado esperando empresas
        );
        return resposta.data;
    } catch (erro) {
        // empresa respondeu, mas a empresa não existe
        if (erro.response.status && [400,404].includes(erro.response.status)) {
            return null;
        }

        //fora do ar, timeout, erro 500 de outro lado
        const falha = new Error ('Serviço de empresas indisponível');
        falha.code = 'EMPRESAS_INDISPONIVEL';
        throw falha;
    }
}

module.exports = {buscarEmpresaPorId}