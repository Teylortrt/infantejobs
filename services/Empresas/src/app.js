const express = require('express');
const cors = require('cors');
const EmpresaRotas = require('./routes/EmpresasRoutes');

const app = express();

//Middlewares globais
app.use(cors()); //libera esse acesso para que outros apps e frontends consigam conversar com o seu serviço sem erros no navegador.
app.use(express.json()); //tradutor de json para o express

// Rota base de saúde/teste
app.get('/', (req, res) => {
    res.send('empresas ta on')
})

app.use('/empresas', EmpresaRotas)

module.exports = app;