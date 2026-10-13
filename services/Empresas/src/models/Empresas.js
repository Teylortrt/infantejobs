
const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'O nome da empresa é obrigatório'],
            trim: true
        },

        cnpj: {
            type: String,
            required: [true, 'O CNPJ é obrigatório'],
            unique: true,
            trim: true
        },

        cidade: {
            type: String,
            required: [true, 'A cidade é obrigatória'],
            trim: true
        },

        endereco: {
            type: String,
            required: [true, 'O endereço é obrigatório'],
            trim: true
        },

        telefone: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Empresa', empresaSchema);
