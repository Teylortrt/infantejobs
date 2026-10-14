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

describe('Suíte de Testes do Microsserviço de candidaturas', () => {

    // 1. Conecta ao banco antes de rodar os testes
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { runtimeAdapters: { os } });
    });

    // 2. Fecha a conexão depois que todos terminarem
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // ----------- TESTES ----------- \\

    

  });