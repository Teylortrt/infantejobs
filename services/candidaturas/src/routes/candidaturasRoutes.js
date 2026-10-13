const express = require('express');
const router = express.Router();
const candidaturaController = require('../controllers/candidaturaController')

// Os caminhos aqui são RELATIVOS ao prefixo '/candidaturas' definido no app.js
router.get('/', candidaturaController.listarCandidaturas);
router.get('/:id', candidaturaController.buscarCandidaturaPorID);
router.post('/', candidaturaController.candidatarParaVaga);
router.patch('/:id/status', candidaturaController.atualizarCandidaturaStatus);
router.delete('/:id', candidaturaController.cancelarCandidatura);





module.exports = router;