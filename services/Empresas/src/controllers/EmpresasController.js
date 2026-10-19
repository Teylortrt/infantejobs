const mongoose = require('mongoose');
const Empresa = require('../models/Empresas');

//=========================
//LISTAR EMPRESAS//
//=========================
// GET /empresas
const listarEmpresas = async (req, res) => {
    try {
        const { nome, cidade, } = req.query;
        const filtro = {};
        if (nome) filtro.nome = nome;
        if (cidade) filtro.cidade = cidade;

        const empresas = await Empresa.find(filtro).sort({ createdAt: -1 });
        return res.status(200).json(empresas);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar empresas' });
    }
};
//=========================
//PUXAR EMPRESA POR ID//
//=========================
// GET /empresas/:id
const buscarEmpresaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const empresa = await Empresa.findById(id);
        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada' });
        }
        return res.status(200).json(empresa);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar empresa' });
    }
};
//=========================
//CRIAR A EMPRESA//
//=========================
// POST /empresas
const criarEmpresa = async (req, res) => {
    try {
        const { nome, cnpj, cidade, telefone, email } = req.body;
    if (!nome || !cnpj || !cidade) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const novaEmpresa = await Empresa.create({ 
        nome, 
        cnpj, 
        cidade,
        telefone,
        email
    });
    return res.status(201).json(novaEmpresa);

    }
    catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao criar empresa' });
    }
};
//=========================
//ATUALIZAR EMPRESA//
//=========================
// PUT /empresas/:id
const atualizarEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const empresa = await Empresa.findByIdAndUpdate(id, req.body,{
            returnDocument: 'after',
            runValidators: true,
            upsert: false
        });
        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada' });   
        }
        return res.status(200).json(empresa);
    }   catch (erro) {
        if (erro.code === 11000) {
            return res.status(400).json({ erro: 'CNPJ ou email já cadastrado' });
        }
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao atualizar empresa' });
    }
};
//=========================
//DELETAR EMPRESA//
//=========================
// DELETE /empresas/:id
const removerEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const empresa = await Empresa.findByIdAndDelete(id);
        if (!empresa) {
            return res.status(404).json({ erro: 'Empresa não encontrada' });
        }
        return res.status(204).send();
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao remover empresa' });
    }
};
module.exports = {
    listarEmpresas,
    buscarEmpresaPorId,
    criarEmpresa,
    atualizarEmpresa,
    removerEmpresa
};