const mongoose = require('mongoose');

const CandidaturasSchema = new mongoose.Schema({
    candidatoId: {
        type: String,
        required: [true, 'O título da vaga é obrigatório'],
        trim: true //Para evitar espaços em branco entre o incio e final
    },
    vagaId: { 
        type: String, 
        required: [true, 'A descrição é obrigatória'] 
    },
    status: { 
        type: Number, 
        required: false
    }
    }, { timestamps: true });

module.exports = mongoose.model('Candidaturas', CandidaturasSchema);