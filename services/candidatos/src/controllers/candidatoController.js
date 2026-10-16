const mongoose = require('mongoose');
const Candidatura = require('../models/Candidato');

//=========================
//LISTAR CANDIDATOS//
//=========================
// GET /candidatos
const listarCandidatos = async (req, res) => {
    try {
        const { nome, cidade, } = req.query;
        const filtro = {};
        if (nome) filtro.nome = nome;
        if (cidade) filtro.cidade = cidade;

        const candidatos = await Candidato.find(filtro).sort({ createdAt: -1 });
        return res.status(200).json(candidatos);

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar candidatos' });
    }
};
//=========================
//PUXAR CANDIDATO POR ID//
//=========================
// GET /candidatos/:id
const buscarCandidatoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const candidato = await Candidato.findById(id);
        if (!candidato) {
            return res.status(404).json({ erro: 'Candidato não encontrado' });
        }
        return res.status(200).json(candidato);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar candidato' });
    }
};
//=========================
//CRIAR O CANDIDATO//
//=========================
// POST /candidatos
const criarCandidato = async (req, res) => {
    try {
        const { nome, cpf, endereco, telefone, email } = req.body;
    if (!nome || !cpf || !endereco || !telefone || !email) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const novoCandidato = new Candidato({ 
        nome, 
        cpf, 
        endereco,
        telefone,
        email
    });
    return res.status(201).json(novoCandidato);
    }
    catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao criar candidato' });
    }
};
//=========================
//ATUALIZAR CANDIDATO//
//=========================
// PUT /candidatos/:id
const atualizarCandidato = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const candidato = await Candidato.findByIdAndUpdate(id, req.body,{
            returnDocument: 'after',
            runValidators: true,
            upsert: false
        });
        if (!candidato) {
            return res.status(404).json({ erro: 'Candidato não encontrado' });   
        }
        return res.status(200).json(candidato);
    }   catch (erro) {
        if (erro.code === 11000) {
            return res.status(400).json({ erro: 'CPF ou email já cadastrado' });
        }
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao atualizar candidato' });
    }
};
//=========================
//DELETAR CANDIDATO//
//=========================
// DELETE /candidatos/:id
const removerCandidato = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const candidato = await Candidato.findByIdAndDelete(id);
        if (!candidato) {
            return res.status(404).json({ erro: 'Candidato não encontrado' });
        }
        return res.status(204).send();
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao remover candidato' });
    }
};
//=========================
//EXPORTA FUNÇÕES//
//=========================
module.exports = {
    listarCandidatos,
    buscarCandidatoPorId,
    criarCandidato,
    atualizarCandidato,
    removerCandidato
};