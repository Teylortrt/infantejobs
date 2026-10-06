// seed.js - Executa a criação das entidades, índices e dados iniciais no MongoDB
const mongoose = require('mongoose');

// URLs dos bancos de dados de cada microsserviço
const MONGO_URIS = {
  empresas: process.env.DB_EMPRESAS || 'mongodb://localhost:27017/db_empresas',
  vagas: process.env.DB_VAGAS || 'mongodb://localhost:27017/db_vagas',
  candidatos: process.env.DB_CANDIDATOS || 'mongodb://localhost:27017/db_candidatos',
  candidaturas: process.env.DB_CANDIDATURAS || 'mongodb://localhost:27017/db_candidaturas'
};

async function popularBanco() {
  console.log('🔄 Iniciando carga e criação de coleções no MongoDB...\n');

  try {
    // -------------------------------------------------------------
    // 1. EMPRESAS (Porta 3001 / db_empresas)
    // -------------------------------------------------------------
    const connEmpresas = await mongoose.createConnection(MONGO_URIS.empresas).asPromise();
    const EmpresaSchema = new mongoose.Schema({
      nome: { type: String, required: true },
      cnpj: { type: String, required: true, unique: true },
      email: { type: String, required: true },
      telefone: { type: String, required: true },
      cidade: { type: String, required: true }
    }, { timestamps: true });

    const Empresa = connEmpresas.model('Empresa', EmpresaSchema);
    await Empresa.deleteMany({}); // Limpa registros antigos para ambiente de teste

    const empresaCriada = await Empresa.create({
      nome: 'Tech Inovações LTDA',
      cnpj: '12.345.678/0001-99',
      email: 'rh@techinovacoes.com.br',
      telefone: '(51) 3322-1100',
      cidade: 'Porto Alegre'
    });
    console.log(`✅ Coleção 'empresas' criada. Empresa ID: ${empresaCriada._id}`);

    // -------------------------------------------------------------
    // 2. CANDIDATOS (Porta 3003 / db_candidatos)
    // -------------------------------------------------------------
    const connCandidatos = await mongoose.createConnection(MONGO_URIS.candidatos).asPromise();
    const CandidatoSchema = new mongoose.Schema({
      nome: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      telefone: { type: String, required: true },
      cidade: { type: String, required: true },
      habilidades: [{ type: String }]
    }, { timestamps: true });

    const Candidato = connCandidatos.model('Candidato', CandidatoSchema);
    await Candidato.deleteMany({});

    const candidatoCriado = await Candidato.create({
      nome: 'João da Silva',
      email: 'joao.silva@email.com',
      telefone: '(51) 98765-4321',
      cidade: 'Canoas',
      habilidades: ['Node.js', 'Express', 'MongoDB', 'JavaScript']
    });
    console.log(`✅ Coleção 'candidatos' criada. Candidato ID: ${candidatoCriado._id}`);

    // -------------------------------------------------------------
    // 3. VAGAS (Porta 3002 / db_vagas)
    // -------------------------------------------------------------
    const connVagas = await mongoose.createConnection(MONGO_URIS.vagas).asPromise();
    const VagaSchema = new mongoose.Schema({
      titulo: { type: String, required: true },
      descricao: { type: String, required: true },
      salario: { type: Number, required: true },
      modalidade: { type: String, enum: ['Presencial', 'Hibrido', 'Remoto'], required: true },
      cidade: { type: String, required: true },
      requisitos: [{ type: String }],
      empresaId: { type: String, required: true }, // Referência à empresa criada acima
      status: { type: String, enum: ['ABERTA', 'FECHADA'], default: 'ABERTA' }
    }, { timestamps: true });

    const Vaga = connVagas.model('Vaga', VagaSchema);
    await Vaga.deleteMany({});

    const vagaCriada = await Vaga.create({
      titulo: 'Desenvolvedor Backend Node.js Júnior',
      descricao: 'Construção e manutenção de APIs REST e microsserviços integrados a bancos NoSQL.',
      salario: 4500,
      modalidade: 'Hibrido',
      cidade: 'Porto Alegre',
      requisitos: ['Node.js', 'Express', 'MongoDB básico', 'Git'],
      empresaId: empresaCriada._id.toString(),
      status: 'ABERTA'
    });
    console.log(`✅ Coleção 'vagas' criada. Vaga ID: ${vagaCriada._id}`);

    // -------------------------------------------------------------
    // 4. CANDIDATURAS (Porta 3004 / db_candidaturas)
    // -------------------------------------------------------------
    const connCandidaturas = await mongoose.createConnection(MONGO_URIS.candidaturas).asPromise();
    const CandidaturaSchema = new mongoose.Schema({
      candidatoId: { type: String, required: true },
      vagaId: { type: String, required: true },
      data: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['ENVIADA', 'EM_ANALISE', 'APROVADA', 'REJEITADA'], 
        default: 'ENVIADA' 
      }
    }, { timestamps: true });

    // Índice composto opcional para garantir que o mesmo candidato não se candidate 2x na mesma vaga
    CandidaturaSchema.index({ candidatoId: 1, vagaId: 1 }, { unique: true });

    const Candidatura = connCandidaturas.model('Candidatura', CandidaturaSchema);
    await Candidatura.deleteMany({});

    const candidaturaCriada = await Candidatura.create({
      candidatoId: candidatoCriado._id.toString(),
      vagaId: vagaCriada._id.toString(),
      status: 'ENVIADA'
    });
    console.log(`✅ Coleção 'candidaturas' criada. Candidatura ID: ${candidaturaCriada._id}`);

    console.log('\n🚀 Todas as coleções, índices e dados mockados foram criados com sucesso!');

    // Fecha conexões
    await connEmpresas.close();
    await connCandidatos.close();
    await connVagas.close();
    await connCandidaturas.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro durante o seed do banco de dados:', error);
    process.exit(1);
  }
}

popularBanco();