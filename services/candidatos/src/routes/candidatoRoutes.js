const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidatoController')

// Os caminhos aqui são RELATIVOS ao prefixo '/candidatos' definido no app.js
router.get('/', candidatoController.listarCandidatos);
router.get('/:id', candidatoController.buscarCandidatoPorId);
router.post('/', candidatoController.criarCandidato);
router.patch('/:id', candidatoController.atualizarCandidato);
router.delete('/:id', candidatoController.removerCandidato);





module.exports = router;