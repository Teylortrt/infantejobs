//Necessário para ler o .env
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const port = process.env.PORT || 3002;

//Conecta o BD
connectDB();

app.listen(port, () => {
  console.log(`🚀 Microsserviço de Vagas rodando na porta ${port}`);
});