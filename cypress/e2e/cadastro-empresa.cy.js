/**
 * Testes e2e do cadastro de empresa: um caminho válido e um caminho
 * inválido (dados ausentes), conforme exigido pelo roteiro de testes.
 */
describe("Cadastro de empresa", () => {
  it("exibe mensagens de validação quando o formulário é enviado vazio", () => {
    cy.visit("/empresa-cadastro.html");

    cy.get("#form-empresa").submit();

    cy.get("#erro-nome").should("have.class", "visible");
    cy.get("#erro-cnpj").should("have.class", "visible");
    cy.get("#erro-email").should("have.class", "visible");
    cy.get("#erro-cidade").should("have.class", "visible");
    cy.get("#alert-empresa").should("contain", "Corrija os campos destacados");
  });

  it("cadastra uma empresa com dados válidos", () => {
    cy.intercept("POST", "**/empresas", { statusCode: 201, body: { id: "e1" } }).as("criarEmpresa");

    cy.visit("/empresa-cadastro.html");

    cy.get("#nome").type("Tech Corp");
    cy.get("#cnpj").type("12.345.678/0001-99");
    cy.get("#email").type("contato@techcorp.com");
    cy.get("#telefone").type("(51) 3333-4444");
    cy.get("#cidade").type("Porto Alegre");

    cy.get("#form-empresa").submit();

    cy.wait("@criarEmpresa").its("request.body").should("deep.include", {
      nome: "Tech Corp",
      cnpj: "12345678000199",
      email: "contato@techcorp.com",
      cidade: "Porto Alegre",
    });

    cy.get("#alert-empresa").should("contain", "Empresa cadastrada com sucesso");
  });

  it("exibe mensagem de erro quando a API retorna HTTP 400", () => {
    cy.intercept("POST", "**/empresas", {
      statusCode: 400,
      body: { message: "CNPJ já cadastrado" },
    }).as("criarEmpresaInvalida");

    cy.visit("/empresa-cadastro.html");

    cy.get("#nome").type("Tech Corp");
    cy.get("#cnpj").type("12.345.678/0001-99");
    cy.get("#email").type("contato@techcorp.com");
    cy.get("#cidade").type("Porto Alegre");

    cy.get("#form-empresa").submit();

    cy.wait("@criarEmpresaInvalida");
    cy.get("#alert-empresa").should("contain", "CNPJ já cadastrado");
  });
});
