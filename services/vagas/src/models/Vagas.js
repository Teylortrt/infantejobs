const mongoose = require('mongoose');

const VagaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'O título da vaga é obrigatório'],
        trim: true //Para evitar espaços em branco entre o incio e final
    },
    descricao: { 
        type: String, 
        required: [true, 'A descrição é obrigatória'] 
    },
    salario: { 
        type: Number, 
        required: false
    },
    modalidade: { 
        type: String, 
        enum: ['Presencial', 'Hibrido', 'Remoto'], 
        required: [true, 'A modalidade deve ser Presencial, Hibrido ou Remoto'] 
    },
    cidade: { 
        type: String, 
        required: [true, 'A cidade é obrigatória'] 
    },
    requisitos: [{ 
        type: String 
    }],
    empresaId: { 
        type: String, 
        required: [true, 'O ID da empresa é obrigatório'] 
    },
    status: { 
        type: String, 
        enum: ['ABERTA', 'FECHADA'], 
        default: 'ABERTA' 
    }
    }, { timestamps: true });

module.exports = mongoose.model('Vaga', VagaSchema);