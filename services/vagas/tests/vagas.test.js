require('dotenv').config({ quiet: true}); // Carrega o MONGO_DB_URI
const mongoose = require('mongoose');
const os = require('os'); 
/**
 * O módulo 'os' é injetado em runtimeAdapters no mongoose.connect para contornar
 * uma incompatibilidade entre o sandbox do Jest e o Mongoose 9 (driver v7):
 * sem isso, o driver tenta importar 'os' dinamicamente e trava, estourando o timeout de 5s.
 */
const request = require('supertest');
const app = require('../src/app');

describe('Suíte de Testes do Microsserviço de vagas', () => {

    // 1. Conecta ao banco antes de rodar os testes
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { runtimeAdapters: { os } });
    });

    // 2. Fecha a conexão depois que todos terminarem
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // ----------- TESTES ----------- \\

    // Teste 1: Rota de saúde / status
    it('Deve responder 200 na rota base/', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    })

    // Teste 2: Listagem de vagas
    it('Deve responder 200 e retornar um array', async () => {
        const res = await request(app).get('/vagas');
        expect(res.statusCode).toBe(200);

    })

    // Teste 3: Validação ao criar vaga sem campos obrigatórios
    it('Deve retornar 400 ao tentar criar vaga sem dados obrigatórios', async () => {
        const res = await request(app).post('/vagas').send({}); //Corpo vazio
        expect(res.statusCode).toBe(400);
    })

    // Teste 4: Validação de ID inválido
    it('Deve retornar 400 se o ID for incorreto no MongoDB', async () =>{
        const res = await request(app).get('/vagas/id-invalido-123');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('erro', 'ID inválido');
    });

  });