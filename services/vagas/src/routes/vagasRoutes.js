const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController')

// Os caminhos aqui são RELATIVOS ao prefixo '/vagas' definido no app.js
router.get('/', vagaController.listarVagas);
router.get('/:id', vagaController.buscarVagaPorId);




module.exports = router;