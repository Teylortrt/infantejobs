const mongoose = require('mongoose');
const Candidatura = require('../models/Candidaturas');
const { buscarVagaPorId } = require('../services/vagasClient');
const { buscarCandidatoPorID } = require('../services/candidatosClient');

// GET /candidaturas
const listarCandidaturas = async (req, res) => {

}

// GET /candidatiras/:id
const buscarCandidaturaPorID = async (req, res) => {

}

// POST /candidaturas
const candidatarParaVaga = async (req, res) => {

}

//PATCH /candidaturas/:id/status
const atualizarCandidaturaStatus = async (req, res) => {

}

// delete /candidaturas/:id
const cancelarCandidatura = async (req, res) => {

}



module.exports = {
    listarCandidaturas,
    buscarCandidaturaPorID,
    candidatarParaVaga,
    atualizarCandidaturaStatus,
    cancelarCandidatura
}
