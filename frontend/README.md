# Guia do frontend

Este documento orienta a equipe a executar o frontend e integrá-lo aos
microsserviços da plataforma. O frontend é composto por páginas HTML, CSS e
JavaScript sem framework; as chamadas HTTP são centralizadas em `js/api.js`.

## Pré-requisitos

- Node.js e npm instalados.
- Dependências instaladas na raiz do repositório.
- Para integração real, microsserviços disponíveis nos endereços configurados
  e com CORS habilitado para a origem do frontend.

## Executar localmente

Na raiz do repositório, instale as dependências e inicie o servidor estático:

```powershell
npm install
npm run serve:frontend
```

Abra <http://localhost:5500>. Use o servidor HTTP em vez de abrir os arquivos
diretamente com `file://`, pois as chamadas à API e os testes dependem de uma
origem HTTP.

Para rodar os testes E2E:

```powershell
npm run test:e2e
```

O script inicia o servidor estático e executa o Cypress. Os testes existentes
interceptam chamadas de API para validar alguns fluxos sem depender dos
microsserviços; isso não substitui um teste de integração com o backend real.

## Configurar os endereços das APIs

Por padrão, `js/api.js` espera estes serviços:

| Serviço | URL base padrão |
| --- | --- |
| Empresas | `http://localhost:3001` |
| Vagas | `http://localhost:3002` |
| Candidatos | `http://localhost:3003` |
| Candidaturas | `http://localhost:3004` |

As URLs podem ser substituídas pelo `localStorage` do navegador. Por exemplo,
no console de desenvolvedor:

```javascript
localStorage.setItem("API_BASE_EMPRESAS", "http://localhost:3001");
localStorage.setItem("API_BASE_VAGAS", "http://localhost:3002");
localStorage.setItem("API_BASE_CANDIDATOS", "http://localhost:3003");
localStorage.setItem("API_BASE_CANDIDATURAS", "http://localhost:3004");
location.reload();
```

Configure os valores antes de recarregar a página. Para voltar ao endereço
padrão de um serviço, remova sua chave correspondente, por exemplo:

```javascript
localStorage.removeItem("API_BASE_VAGAS");
location.reload();
```

As URLs configuradas são lidas quando `js/api.js` é carregado. Se um serviço
usar outro prefixo ou formato de endpoint, alinhe o contrato com a equipe e
atualize essa camada central; as páginas não devem chamar `fetch()` diretamente.

## Contrato esperado pelo frontend

As funções de `js/api.js` usam os seguintes endpoints:

| Serviço | Operações esperadas |
| --- | --- |
| Empresas | `GET /empresas`, `GET /empresas/:id`, `POST /empresas`, `PUT /empresas/:id`, `DELETE /empresas/:id` |
| Vagas | `GET /vagas`, `GET /vagas/:id`, `POST /vagas`, `PUT /vagas/:id`, `DELETE /vagas/:id` |
| Candidatos | `GET /candidatos`, `GET /candidatos/:id`, `POST /candidatos`, `PUT /candidatos/:id`, `DELETE /candidatos/:id` |
| Candidaturas | `GET /candidaturas`, `GET /candidaturas/:id`, `POST /candidaturas`, `PUT /candidaturas/:id`, `DELETE /candidaturas/:id` |

As operações de listagem devem retornar arrays JSON; operações de criação e
consulta devem retornar o registro em JSON. Erros devem retornar um status HTTP
de falha e, preferencialmente, uma mensagem em `message` ou `error` para que a
interface possa exibi-la.

Os formulários enviam estes campos:

- **Empresa:** `nome`, `cnpj` (somente dígitos), `email`, `telefone`, `cidade`.
- **Vaga:** `titulo`, `descricao`, `salario` (número ou omitido),
  `modalidade` (`Presencial`, `Hibrido` ou `Remoto`), `cidade`, `requisitos`
  (array de strings), `empresaId` e `status` (`ABERTA` ou `FECHADA`).
- **Candidato:** `nome`, `email`, `telefone`, `cidade`, `habilidades` (array
  de strings) e `curriculoUrl` (opcional).
- **Candidatura:** `vagaId`, `candidatoId`, `data` (data ISO) e `status`
  (`ENVIADA`).

Os identificadores retornados devem estar em `id` ou `_id`. Vagas precisam
incluir `empresaId`; candidatos precisam incluir `nome` e `email` para aparecer
na seleção da candidatura. O frontend também usa campos como `titulo`,
`descricao`, `modalidade`, `cidade`, `salario`, `status` e `requisitos` nas
vagas, e `nome`, `email`, `telefone`, `cidade`, `habilidades` e `curriculoUrl`
nos candidatos.

O formulário de vaga exige que a API de empresas retorne uma lista de empresas
com identificador e `nome`. O fluxo de candidatura consulta vagas abertas e
candidatos cadastrados antes de permitir o envio.

## Backend disponível neste repositório

No estado atual, o repositório contém o microsserviço de vagas em
`services/vagas`, configurado para a porta `3002`, com rotas de listagem,
consulta, criação, atualização, fechamento e remoção. A API do frontend também
espera serviços de empresas, candidatos e candidaturas nas portas `3001`,
`3003` e `3004`; confirme com a equipe onde estão esses serviços antes de
esperar que todos os fluxos funcionem com dados reais.

Na listagem de vagas, o frontend envia título, cidade e modalidade como filtros;
além disso, aplica os filtros localmente. O serviço de vagas deste repositório
filtra no servidor por status, modalidade, cidade e empresa, mas não por título.

Para o navegador conseguir chamar os microsserviços, cada API deve habilitar
CORS para a origem em que o frontend está sendo servido (por padrão,
`http://localhost:5500`) e aceitar JSON nas requisições de criação e atualização.

## Diagnóstico de integração

1. Abra as ferramentas de desenvolvedor do navegador e confira a aba **Network**.
2. Verifique se a URL chamada corresponde à base configurada e ao endpoint
   documentado.
3. Em falha de rede, confirme que o serviço está ativo e acessível a partir do
   navegador.
4. Em erro de CORS, configure CORS no serviço; não tente corrigir isso no
   JavaScript do frontend.
5. Em `400` ou `500`, compare o corpo enviado pelo formulário com o contrato do
   serviço e confira o corpo de erro retornado.
6. Teste o fluxo completo com backend real: cadastrar empresa, publicar vaga,
   cadastrar candidato, abrir os detalhes da vaga e enviar uma candidatura.

Se houver divergência de nomes de campos, enums, prefixos ou formatos de
resposta, alinhe primeiro o contrato entre as equipes e atualize
`js/api.js`/as páginas afetadas e este guia juntos.
