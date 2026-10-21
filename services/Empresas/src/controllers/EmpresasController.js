const mongoose = require('mongoose');
const Empresa = require('../models/Empresas');

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
//LISTAR EMPRESAS//
//=========================
// GET /empresas
const listarEmpresas = async (req, res) => {
    try {
        const { nome, cidade, cpf, cnpj } = req.query;
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
        if (cnpj) {
            const cnpjLimpo = String(cnpj).replace(/\D/g, '');
            if (cnpjLimpo.length !== 14) {
                return res.status(400).json({ erro: 'CNPJ inválido' });
            }
            filtro.cnpj = criarRegexDocumento(cnpjLimpo, [2, 3, 3, 4, 2]);
        }

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
        const { nome, cnpj, cpf, cidade, telefone, email } = req.body;
        const cnpjLimpo = String(cnpj || '').replace(/\D/g, '');
        const cpfLimpo = String(cpf || '').replace(/\D/g, '');
        if (!nome || !cnpjLimpo || !cidade) {
            return res.status(400).json({ erro: 'Nome, CNPJ e cidade são obrigatórios' });
        }
        if (cnpjLimpo.length !== 14) {
            return res.status(400).json({ erro: 'CNPJ inválido' });
        }
        if (cpfLimpo && cpfLimpo.length !== 11) {
            return res.status(400).json({ erro: 'CPF do responsável inválido' });
        }

        const novaEmpresa = await Empresa.create({
            nome,
            cnpj: cnpjLimpo,
            cpf: cpfLimpo || undefined,
            cidade,
            telefone,
            email
        });
        return res.status(201).json(novaEmpresa);
    } catch (erro) {
        if (erro.code === 11000) {
            return res.status(400).json({ erro: 'CNPJ já cadastrado' });
        }
        if (erro.name === 'ValidationError') {
            return res.status(400).json({ erro: erro.message });
        }
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
        const dados = { ...req.body };
        if (dados.cnpj) dados.cnpj = String(dados.cnpj).replace(/\D/g, '');
        if (dados.cpf) {
            dados.cpf = String(dados.cpf).replace(/\D/g, '');
            if (dados.cpf.length !== 11) {
                return res.status(400).json({ erro: 'CPF do responsável inválido' });
            }
        }
        const empresa = await Empresa.findByIdAndUpdate(id, dados,{
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
        if (erro.name === 'ValidationError') {
            return res.status(400).json({ erro: erro.message });
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