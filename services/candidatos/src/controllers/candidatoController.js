const mongoose = require('mongoose');
const Candidato = require('../models/Candidato');

function criarRegexDocumento(digitos, grupos) {
    const partes = [];
    let inicio = 0;
    for (const tamanho of grupos) {
        partes.push(digitos.slice(inicio, inicio + tamanho));
        inicio += tamanho;
    }
    return new RegExp(`^${partes.join('[.\\-/\\s]?')}$`);
}

//=========================
//LISTAR CANDIDATOS//
//=========================
// GET /candidatos
const listarCandidatos = async (req, res) => {
    try {
        const { nome, cidade, cpf } = req.query;
        const filtro = {};
        if (nome) filtro.nome = nome;
        if (cidade) filtro.cidade = cidade;
        if (cpf) {
            const cpfLimpo = String(cpf).replace(/\D/g, '');
            if (cpfLimpo.length !== 11) {
                return res.status(400).json({ erro: 'CPF inválido' });
            }
            filtro.cpf = criarRegexDocumento(cpfLimpo, [3, 3, 3, 2]);
        }

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
        const dados = { ...req.body };
        if (dados.cpf) dados.cpf = String(dados.cpf).replace(/\D/g, '');
        const novoCandidato = await Candidato.create(dados);
        return res.status(201).json(novoCandidato);
    } catch (erro) {
        if (erro.code === 11000) {
            return res.status(400).json({ erro: 'CPF ou email já cadastrado' });
        }
        if (erro.name === 'ValidationError') {
            return res.status(400).json({ erro: erro.message });
        }
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
        const dados = { ...req.body };
        if (dados.cpf) dados.cpf = String(dados.cpf).replace(/\D/g, '');
        const candidato = await Candidato.findByIdAndUpdate(id, dados,{
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
        if (erro.name === 'ValidationError') {
            return res.status(400).json({ erro: erro.message });
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