//Necessário para ler o .env
require('dotenv').config();

const express = require('express');
const app = express()
const port = 3002

app.get('/', (req, res) => {
  res.send('Teste do Dev!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})