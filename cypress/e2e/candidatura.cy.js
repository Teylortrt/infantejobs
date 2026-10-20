/**
 * Teste e2e do fluxo principal de candidatura (Home -> Vagas -> Detalhes
 * -> Candidatura -> Confirmação), conforme especificado no roteiro de
 * testes do projeto.
 *
 * As respostas da API são interceptadas (cy.intercept) para que o teste
 * do frontend seja independente da disponibilidade do backend/microsserviços.
 */
describe("Fluxo de candidatura", () => {
  const vagaMock = {
    id: "1",
    titulo: "Desenvolvedor Node.js",
    descricao: "Desenvolvimento de APIs REST com Node.js e Express.",
    salario: 5000,
    modalidade: "Remoto",
    cidade: "Porto Alegre",
    status: "ABERTA",
    empresaId: "e1",
    requisitos: ["Node.js", "MongoDB", "Git"],
  };
  const empresaMock = {
    id: "e1",
    nome: "Tech Corp",
    email: "contato@techcorp.com",
    telefone: "(51) 3333-4444",
    cidade: "Porto Alegre",
  };
  const candidatoMock = { id: "c1", nome: "João Silva", email: "joao@email.com", cpf:"01234567890", telefone: "51 999999999"};

  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3002/vagas*", { body: [vagaMock] }).as("listarVagas");
    cy.intercept("GET", "http://localhost:3002/vagas/1", { body: vagaMock }).as("obterVaga");
    cy.intercept("GET", "http://localhost:3001/empresas*", { body: [empresaMock] }).as("listarEmpresas");
    cy.intercept("GET", "http://localhost:3001/empresas/e1", { body: empresaMock }).as("obterEmpresa");
    cy.intercept("GET", "http://localhost:3003/candidatos*", { body: [candidatoMock] }).as("listarCandidatos");
    cy.intercept("POST", "http://localhost:3004/candidaturas", { statusCode: 201, body: { id: "cand1", status: "ENVIADA" } }).as("criarCandidatura");
  });

  it("permite abrir uma vaga, candidatar-se e ver a mensagem de sucesso", () => {
    cy.visit("/index.html");

    cy.contains("Ver vagas disponíveis").click();
    cy.wait("@listarVagas");
    cy.contains(vagaMock.titulo).should("be.visible");

    cy.contains("Ver detalhes").click();
    cy.wait(["@obterVaga", "@obterEmpresa"]);
    cy.contains("h2", vagaMock.titulo).should("be.visible");

    cy.contains("Candidatar-se").click();
    cy.wait(["@listarVagas", "@listarCandidatos"]);

    cy.get("#vagaId").should("have.value", "1");
    cy.get("#candidatoId").select(`${candidatoMock.nome} (${candidatoMock.email})`);
    cy.get("#form-candidatura").submit();

    cy.wait("@criarCandidatura");
    cy.get("#alert-candidatura").should("contain", "Candidatura enviada com sucesso");
  });

  it("exibe erro de validação quando nenhuma vaga ou candidato é selecionado", () => {
    cy.visit("/candidatura.html");
    cy.wait(["@listarVagas", "@listarCandidatos"]);

    cy.get("#form-candidatura").submit();

    cy.get("#erro-vagaId").should("have.class", "visible");
    cy.get("#erro-candidatoId").should("have.class", "visible");
    cy.get("#alert-candidatura").should("contain", "Selecione a vaga e o candidato");
  });
});
