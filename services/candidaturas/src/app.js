const express = require('express');
const cors = require('cors');
const vagasRoutes = require('./routes/vagasRoutes');

const app = express();

//Middlewares globais
app.use(cors()); //libera esse acesso para que outros apps e frontends consigam conversar com o seu serviço sem erros no navegador.
app.use(express.json()); //tradutor de json para o express

// Rota base de saúde/teste
app.get('/', (req, res) => {
    res.send('API DE CANDIDATURAS RODANDO')
})

// Futuramente aqui entrarão as rotas:
// const vagaRoutes = require('./src/routes/vagaRoutes');
// app.use('/vagas', vagaRo
app.use('/vagas', vagasRoutes)

module.exports = app;

  