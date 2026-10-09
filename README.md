# Plataforma de Vagas e Candidaturas (InfanteJobs)

Projeto Integrador de uma plataforma web distribuída para publicação de vagas por empresas e envio de candidaturas por profissionais.

---

## 📌 Visão Geral do Projeto

O sistema foi concebido utilizando uma **arquitetura de microsserviços desacoplados**, com comunicação síncrona via **HTTP/REST (JSON)** entre serviços e banco de dados **MongoDB** isolado logicamente por domínio.

### 🛠️ Stack Tecnológica
* **Backend:** Node.js, Express, Mongoose (MongoDB).
* **Frontend:** HTML5 semântico, CSS3, Skeleton CSS (grid de 12 colunas) e Vanilla JavaScript nativo (`fetch` e manipulação de DOM).
* **Testes Automatizados:** Jest + Supertest (testes de integração no backend) e Cypress (testes de ponta a ponta E2E no frontend).

---

## 🌐 Topologia de Microsserviços e Portas

O MongoDB roda como serviço único local na porta padrão `27017`, gerenciando 4 bancos lógicos isolados:

| Microsserviço | Porta HTTP | Banco MongoDB (`MONGODB_URI`) | Responsabilidade Principal |
| :--- | :---: | :--- | :--- |
| **`empresas`** | `3001` | `mongodb://localhost:27017/db_empresas` | CRUD de dados corporativos (nome, CNPJ, contato). |
| **`vagas`** | `3002` | `mongodb://localhost:27017/db_vagas` | CRUD de vagas e ciclo de vida (`ABERTA`/`FECHADA`). Consulta `:3001` via HTTP para exibir dados da empresa em `GET /vagas/:id`. |
| **`candidatos`** | `3003` | `mongodb://localhost:27017/db_candidatos` | CRUD de perfil profissional (dados pessoais, habilidades). |
| **`candidaturas`** | `3004` | `mongodb://localhost:27017/db_candidaturas` | Registro de inscrições. Consulta `:3002` e `:3003` via HTTP para validar existência antes de salvar. |

---

## 📂 Organização do Repositório

```text
plataforma-vagas/
│
├── .gitignore
├── README.md
├── seed.js                          # Carga inicial e mock dos bancos de dados
│
├── frontend/
│   ├── index.html                   # Página inicial / Home
│   ├── vagas.html                   # Listagem e busca de vagas
│   ├── vaga-detalhes.html           # Detalhes da vaga e dados da empresa
│   ├── cadastro-empresa.html        # Formulário de criação de empresa
│   ├── cadastro-vaga.html           # Formulário de criação de vaga
│   ├── cadastro-candidato.html      # Formulário de cadastro de candidato
│   ├── candidatos.html              # Listagem e consulta de candidatos
│   ├── candidatar.html              # Formulário de candidatura
│   │
│   ├── css/
│   │   ├── normalize.css            # CSS reset do Skeleton
│   │   ├── skeleton.css             # Grid responsivo e tipografia base
│   │   └── custom.css               # Estilos complementares do projeto
│   │
│   └── js/
│       ├── api.js                   # Configuração base das URLs das APIs
│       ├── empresas.js              # Fetch e DOM para empresas
│       ├── vagas.js                 # Fetch e DOM para listagem e detalhes
│       ├── candidatos.js            # Fetch e DOM para candidatos
│       └── candidaturas.js          # Fetch e DOM para envio de candidaturas
│
├── services/
│   │
│   ├── empresas/                    # Microsserviço 1 (Porta 3001)
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js      # Conexão Mongoose com db_empresas
│   │   │   ├── controllers/
│   │   │   │   └── empresaController.js
│   │   │   ├── models/
│   │   │   │   └── Empresa.js       # Schema: nome, cnpj, email, telefone, cidade
│   │   │   ├── routes/
│   │   │   │   └── empresaRoutes.js # GET, POST, PUT, DELETE /empresas
│   │   │   └── app.js               # Middlewares (cors, json) e rotas para Jest
│   │   ├── tests/
│   │   │   └── empresas.test.js     # Testes de integração Jest + Supertest
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── server.js                # Inicializa app.listen(3001)
│   │
│   ├── vagas/                       # Microsserviço 2 (Porta 3002)
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js      # Conexão Mongoose com db_vagas
│   │   │   ├── controllers/
│   │   │   │   └── vagaController.js
│   │   │   ├── models/
│   │   │   │   └── Vaga.js          # Schema: titulo, salario, empresaId, status...
│   │   │   ├── routes/
│   │   │   │   └── vagaRoutes.js    # GET, POST, PUT, DELETE /vagas
│   │   │   ├── services/
│   │   │   │   └── empresaClient.js # Fetch HTTP interno: busca empresa na porta 3001
│   │   │   └── app.js
│   │   ├── tests/
│   │   │   └── vagas.test.js
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── server.js                # Inicializa app.listen(3002)
│   │
│   ├── candidatos/                  # Microsserviço 3 (Porta 3003)
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── database.js      # Conexão Mongoose com db_candidatos
│   │   │   ├── controllers/
│   │   │   │   └── candidatoController.js
│   │   │   ├── models/
│   │   │   │   └── Candidato.js     # Schema: nome, email, telefone, cidade, habilidades
│   │   │   ├── routes/
│   │   │   │   └── candidatoRoutes.js # GET, POST, PUT, DELETE /candidatos
│   │   │   └── app.js
│   │   ├── tests/
│   │   │   └── candidatos.test.js
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── server.js                # Inicializa app.listen(3003)
│   │
│   └── candidaturas/                # Microsserviço 4 (Porta 3004)
│       ├── src/
│       │   ├── config/
│       │   │   └── database.js      # Conexão Mongoose com db_candidaturas
│       │   ├── controllers/
│       │   │   └── candidaturaController.js
│       │   ├── models/
│       │   │   └── Candidatura.js   # Schema: candidatoId, vagaId, data, status
│       │   ├── routes/
│       │   │   └── candidaturaRoutes.js # GET, POST, PUT, DELETE /candidaturas
│       │   ├── services/
│       │   │   ├── vagaClient.js    # Fetch HTTP: valida se a vaga existe (porta 3002)
│       │   │   └── candidatoClient.js # Fetch HTTP: valida se o candidato existe (porta 3003)
│       │   └── app.js
│       ├── tests/
│       │   └── candidaturas.test.js
│       ├── .env.example
│       ├── package.json
│       └── server.js                # Inicializa app.listen(3004)
│
└── cypress/
    ├── e2e/
    │   ├── empresas.cy.js           # E2E: Cadastro e listagem de empresas
    │   ├── vagas.cy.js              # E2E: Criação e visualização de vagas
    │   ├── candidatos.cy.js         # E2E: Cadastro de candidatos
    │   └── candidatura-fluxo.cy.js  # E2E: Fluxo completo (selecionar vaga -> candidatar-se -> sucesso)
    ├── fixtures/
    │   └── dados-teste.json         # Dados estáticos simulados para os testes E2E
    ├── support/
    │   ├── commands.js
    │   └── e2e.js
    ├── cypress.config.js
    └── package.json                 # Dependência isolada do Cypress na raiz
```

---

## 🧪 Como Preparar e Executar o Ambiente de Testes

Cada microsserviço possui sua própria suíte de testes automatizados utilizando **Jest** e **Supertest**.

### 1. Pré-requisito de Arquitetura (`app.js` vs `server.js`)
Para que o Supertest consiga testar as rotas em memória sem conflito de portas de rede (TCP):
* **`app.js`**: Instancia o Express, configura middlewares e rotas, e exporta a instância (`module.exports = app;`) sem executar `app.listen()`.
* **`server.js`**: Importa o `app`, conecta ao MongoDB e executa o `app.listen(PORT)`.

---

### 2. Instalação das Dependências de Teste
Entre na pasta do microsserviço que deseja testar (por exemplo, `services/vagas`):

```bash
cd services/<nome-do-servico>
npm install -D jest supertest
```

* **`jest`**: Test runner e biblioteca de asserções (`describe`, `it`, `expect`).
* **`supertest`**: Simula requisições HTTP (`GET`, `POST`, `PUT`, `DELETE`) diretamente contra o `app.js` em memória.

---

### 3. Configuração do `package.json`
Verifique se o script `"test"` está configurado no `package.json` do respectivo serviço:

```json
"scripts": {
  "test": "jest",
  "start": "node server.js",
  "dev": "node --watch server.js"
}
```

---

### 4. Estrutura Padrão do Arquivo de Teste (`tests/<servico>.test.js`)
Para serviços que interagem com o banco de dados MongoDB, utilize a estrutura de ciclo de vida abaixo:

```javascript
// 1. Carrega as variáveis de ambiente
require('dotenv').config({ quiet: true });

const mongoose = require('mongoose');
const os = require('os'); // Evita timeout do driver do MongoDB na sandbox do Jest (Mongoose 9)
const request = require('supertest');
const app = require('../src/app');

describe('Suíte de Testes do Microsserviço', () => {

  // 2. Conecta ao banco antes de rodar os testes
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { 
      runtimeAdapters: { os } 
    });
  });

  // 3. Fecha a conexão ao finalizar para encerrar handles abertos
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 4. Casos de Teste
  it('Deve responder 200 na rota base /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

});
```

---

### 5. Executando os Testes

Dentro da pasta do microsserviço:

* **Executar todos os testes uma vez:**
  ```bash
  npm test
  ```

* **Modo interativo (re-executa automaticamente ao salvar arquivos):**
  ```bash
  npm test -- --watch
  ```

* **Diagnosticar operações assíncronas ou conexões pendentes:**
  ```bash
  npm test -- --detectOpenHandles
  ```

