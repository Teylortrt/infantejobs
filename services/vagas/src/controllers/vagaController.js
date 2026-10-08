const mongoose = require('mongoose');
const Vaga = require('../models/Vagas');
// Cionexao com vagas



// GET /vagas  (aceita filtros: ?status=ABERTA&modalidade=Remoto)
const listarVagas = async (req, res) => {
    try {
        const { status, modalidade, cidade, empresaId} = req.query;
        const filtro = {};
        if (status) filtro.status = status;
        if (modalidade) filtro.modalidade = modalidade;
        if (cidade) filtro.cidade = cidade;
        if (empresaId) filtro.empresaId = empresaId;

        const vagas = await Vaga.find(filtro).sort({ createdAt: -1 });
        return res.status(200).json(vagas);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar vagas' });
    }
}


//GET /vagas/:id
const buscarVagaPorId = async (req, res) => {
    try{
        //verifica se o ID existe no BD
        const {id} = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({erro: 'ID inválido'});
        }

        // caso não ache o id da vaga
        const vaga = await Vaga.findById(id);
        if (!vaga) {
            return res.status(404).json({erro: 'Vaga não encontrada'});
        }

        // retorna a vaga em json
        return res.status(200).json(vaga)

    } catch (erro) {
        console.log(erro)
        return res.status(500).json({erro: 'Erro ao buscar vaga'})
    }
}

//PUT /vagas
const criarVaga = async (req, res) => {
    try {
        const novaVaga = await Vaga.create(req.body);
        return res.status(201).json(novaVaga);
    } catch (erro){
        //validadtion error = faltou campo obrigatorio, enum errado, etc
        return res.status(400).jsno({erro: 'Dados invalidos', detalhes: erro.message});
    }
}




//exportar funções
module.exports = {
    listarVagas,
    buscarVagaPorId,
    criarVaga,

}