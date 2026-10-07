//Necessário para ler o .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express()
const port = process.env.PORT || 3002;

//Conecta o BD
connectDB()

//Middlewares
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Api de Vagas rodando!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})