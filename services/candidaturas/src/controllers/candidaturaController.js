const mongoose = require('mongoose');
const Candidatura = require('../models/Candidaturas');
const { buscarVagaPorId } = require('../services/vagasClient');
const { buscarCandidatoPorID } = require('../services/candidatosClient');

// GET /candidaturas (aceita filtros: ?status=ENVIADA&candidatoID=:id)
const listarCandidaturas = async (req, res) => {
    try{
        const {candidatoID, vagaID, data, status} = req.query
        const filtro = {};
        if (candidatoID) filtro.candidatoID = candidatoID;
        if (vagaID) filtro.vagaID = vagaID;
        if (data) filtro.data = data;
        if (status) filtro.status = status;

        const candidaturas = await Candidatura.find(filtro).sort({ createdAt: -1})
        return res.status(200).json(candidaturas);
    } catch (erro){
        console.error(erro)
        return res.status(500).json({ erro: 'Erro ao buscar candidatura'})
    }
}

// GET /candidatiras/:id
const buscarCandidaturaPorID = async (req, res) => {
    try {
        //verifica se existe a candidatura pelo ID no BD
        const {id} = req.params;
            if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({erro: 'Candidatura não encontrada'})
        }

        // caso não ache o id da candidatura
        const candidatura = await Candidatura.findById(id);
        if (!candidatura) {
            return res.status(404).json({erro: 'Candidatura não encontrada'});
        }

        //ESPAÇO PARA PROCURAR VAGA POR ID


        //ESPAÇO PARA PROCURAR CANDIDATO POR ID

        return res.status(200).json(candidatura)
    } catch (erro) {
        console.error(erro)
        return res.status(500).json(erro)
    }
}

// POST /candidaturas
const candidatarParaVaga = async (req, res) => {
    try{
        // espaço para filtrar se existe ID da empresa

        //espaço para verificar se existe ID do candidato

        const novaCandidatura = await Candidatura.create(req.body);
        return res.status(201).json(novaCandidatura)

    } catch (erro){
        console.error(500)
        return res.status(400).json({ erro: 'Erro ao criar candidatura', detalhes: erro.message });
    }
}

//PATCH /candidaturas/:id/status
const atualizarCandidaturaStatus = async (req, res) => {
    try{
        const {id} = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({erro: 'ID invalído'});
        }

        const candidatura = await Candidatura.findById(id);
        if(!candidatura) {
            return res.status(404).json({erro: 'Candidatura não encontrada'})
        }

        const { status: novoStatus} = req.body;
        const statusValidos = ['ENVIADA', 'EM_ANALISE', 'APROVADA', 'REJEITADA'];

        // verifica se esse status é valido
        if (!novoStatus || !statusValidos.includes(novoStatus)) {
            return res.status(400).json({ erro: 'Status inválido. Escolha: ENVIADA, EM_ANALISE, APROVADA ou REJEITADA' });
        }

        //verificar se já esta na ultima fase (REJEITA || APROVADA)
        if (candidatura.status === 'REJEITADA' || candidatura.status === 'APROVADA'){
            return res.status(404).json({erro: 'Candidatura já avalidada!'});
        }

        //verifica se ja possui este status
        if (candidatura.status === novoStatus) {
            return res.status(400).json({ erro: 'A candidatura já possui este status' });
        }

        candidatura.status = novoStatus;
        await candidatura.save();
        return res.status(200).json(candidatura);

    } catch (erro) {
        return res.status(400).json({ erro: 'Candidatura não encontrada'})
    }
}

// delete /candidaturas/:id
const cancelarCandidatura = async (req, res) => {
    try{
        const {id} = req.params;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({erro: 'ID inválido'})
        }

        const candidatura = await Candidatura.findByIdAndDelete(id);
        if (!candidatura) {
            return res.status(404).json({erro: "Candidatura não encontrada"})
        }
        return res.status(204).send(); // 204 = sucesso, sem corpo


    } catch(erro){
        console.error(erro)
        return res.status(500).json({erro: 'Erro ao remover a candidatura'})
    }
}



module.exports = {
    listarCandidaturas,
    buscarCandidaturaPorID,
    candidatarParaVaga,
    atualizarCandidaturaStatus,
    cancelarCandidatura
}
