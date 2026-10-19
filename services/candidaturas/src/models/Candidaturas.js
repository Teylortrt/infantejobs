const mongoose = require('mongoose');

const CandidaturasSchema = new mongoose.Schema({
    candidatoId: {
        type: String,
        required: [true, 'O ID do Candidato é obrigatório'],
    },
    candidatoNome: {
        type: String,
        required: [true, 'O nome do Candidato é obrigatório']
    },
    vagaId: { 
        type: String, 
        required: [true, 'O ID da vaga é obrigatório'] 
    },
    vagaNome: {
        type: String,
        required: [true, 'O nome da vaga é obrigatório']
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

CandidaturasSchema.index({
    candidatoID: 1, vagaID: 1},
    {unique: true});

module.exports = mongoose.model('Candidaturas', CandidaturasSchema);