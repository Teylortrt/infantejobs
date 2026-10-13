const mongoose = require('mongoose');
const Candidatura = require('../models/Candidaturas');
const { buscarVagaPorId } = require('../services/vagasClient');
const { buscarCandidatoPorID } = require('../services/candidatosClient');

