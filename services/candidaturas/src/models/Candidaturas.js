const mongoose = require('mongoose');

const CandidaturasSchema = new mongoose.Schema({
    candidatoId: {
        type: String,
        required: [true, 'O ID do Candidato é obriatório'],
    },
    vagaId: { 
        type: String, 
        required: [true, 'O ID da vaga é obrigatório'] 
    },
    data: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['ENVIADA', 'EM_ANALISE', 'APROVADA', 'REJEITADA'], 
        default: 'ENVIADA' 
    }
    }, { timestamps: true });

module.exports = mongoose.model('Candidaturas', CandidaturasSchema);