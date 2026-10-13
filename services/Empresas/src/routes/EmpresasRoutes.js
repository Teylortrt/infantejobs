const express = require('express');
const router = express.Router();
const EmpresasController = require('../controllers/EmpresasController')

// Os caminhos aqui são RELATIVOS ao prefixo '/empresas' definido no app.js
router.get('/', EmpresasController.listarEmpresas);
router.get('/:id', EmpresasController.buscarEmpresaPorId);
router.post('/', EmpresasController.criarEmpresa);
router.put('/:id', EmpresasController.atualizarEmpresa);
router.delete('/:id', EmpresasController.removerEmpresa);






module.exports = router;