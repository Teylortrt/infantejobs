const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController')

// Os caminhos aqui são RELATIVOS ao prefixo '/vagas' definido no app.js
router.get('/', vagaController.listarVagas);
router.get('/:id', vagaController.buscarVagaPorId);
router.post('/', vagaController.criarVaga);
router.put('/:id', vagaController.atualizarVaga);
router.patch('/:id/fechar', vagaController.fecharVaga);
router.delete('/:id', vagaController.removerVaga);





module.exports = router;