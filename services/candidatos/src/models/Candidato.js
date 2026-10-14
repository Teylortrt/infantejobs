
const mongoose = require('mongoose');
// Definindo o schema do candidato
const candidatoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'O nome do candidato é obrigatório'],
            trim: true
        },

        cpf: {
            type: String,
            required: [true, 'O CPF é obrigatório'],
            unique: true,
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
// Criando o modelo do candidato
module.exports = mongoose.model('Candidato', candidatoSchema);
