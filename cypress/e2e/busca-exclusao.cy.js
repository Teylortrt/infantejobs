describe("Busca e exclusão por documento", () => {
  it("busca candidato pelo CPF e permite excluí-lo", () => {
    let removido = false;
    cy.intercept("GET", "**/candidatos*", (req) => {
      req.reply({
        statusCode: 200,
        body: req.query.cpf && !removido
          ? [{
              _id: "c1",
              nome: "Maria Silva",
              cpf: "123.456.789-00",
              email: "maria@example.com",
              cidade: "Porto Alegre",
            }]
          : [],
      });
    }).as("listarCandidatos");
    cy.intercept("DELETE", "**/candidatos/c1", (req) => {
      removido = true;
      req.reply({ statusCode: 204 });
    }).as("excluirCandidato");

    cy.visit("/candidatos.html");
    cy.wait("@listarCandidatos");
    cy.get("#busca-cpf").type("123.456.789-00");
    cy.get("#form-busca-candidatos").submit();
    cy.wait("@listarCandidatos").its("request.url").should("include", "cpf=12345678900");
    cy.contains(".card", "Maria Silva").should("contain", "***.***.789-00");

    cy.on("window:confirm", () => true);
    cy.contains(".card", "Maria Silva").contains("button", "Excluir").click();
    cy.wait("@excluirCandidato");
    cy.wait("@listarCandidatos");
    cy.get("#alert-candidatos").should("contain", "Candidato excluído com sucesso");
  });

  it("busca empresa pelo CPF do responsável e permite excluí-la", () => {
    let removida = false;
    cy.intercept("GET", "**/empresas*", (req) => {
      req.reply({
        statusCode: 200,
        body: req.query.cpf && !removida
          ? [{
              _id: "e1",
              nome: "Tech Corp",
              cnpj: "12345678000199",
              cpf: "123.456.789-00",
              cidade: "Porto Alegre",
            }]
          : [],
      });
    }).as("listarEmpresas");
    cy.intercept("DELETE", "**/empresas/e1", (req) => {
      removida = true;
      req.reply({ statusCode: 204 });
    }).as("excluirEmpresa");

    cy.visit("/empresas.html");
    cy.wait("@listarEmpresas");
    cy.get("#busca-documento-empresa").type("123.456.789-00");
    cy.get("#form-busca-empresas").submit();
    cy.wait("@listarEmpresas").its("request.url").should("include", "cpf=12345678900");
    cy.contains(".card", "Tech Corp").should("contain", "***.***.789-00");

    cy.on("window:confirm", () => true);
    cy.contains(".card", "Tech Corp").contains("button", "Excluir").click();
    cy.wait("@excluirEmpresa");
    cy.wait("@listarEmpresas");
    cy.get("#alert-empresas").should("contain", "Empresa excluída com sucesso");
  });

  it("busca candidato pelo CPF e permite editá-lo", () => {
    const candidato = {
      _id: "c2",
      nome: "João Souza",
      cpf: "12345678900",
      email: "joao@example.com",
      telefone: "51999999999",
      cidade: "Porto Alegre",
      habilidades: ["JavaScript"],
    };
    let atualizado = false;
    cy.intercept("GET", "**/candidatos*", (req) => {
      req.reply({
        statusCode: 200,
        body: req.query.cpf
          ? [{ ...candidato, email: atualizado ? "joao.novo@example.com" : candidato.email }]
          : [],
      });
    }).as("listarCandidatos");
    cy.intercept("PATCH", "**/candidatos/c2", (req) => {
      atualizado = true;
      req.reply({ statusCode: 200, body: { ...candidato, ...req.body } });
    }).as("atualizarCandidato");

    cy.visit("/candidatos.html");
    cy.wait("@listarCandidatos");
    cy.get("#busca-cpf").type("12345678900");
    cy.get("#form-busca-candidatos").submit();
    cy.wait("@listarCandidatos");
    cy.contains(".card", "João Souza").contains("button", "Editar").click();
    cy.contains(".card", "João Souza").find('input[name="email"]').clear().type("joao.novo@example.com");
    cy.contains(".card", "João Souza").contains("button", "Salvar alterações").click();
    cy.wait("@atualizarCandidato").its("request.body").should("include", {
      cpf: "12345678900",
      email: "joao.novo@example.com",
    });
    cy.wait("@listarCandidatos");
    cy.get("#alert-candidatos").should("contain", "Candidato atualizado com sucesso");
  });

  it("busca empresa pelo CNPJ e permite editá-la", () => {
    const empresa = {
      _id: "e2",
      nome: "Tech Corp",
      cnpj: "12345678000199",
      cpf: "12345678900",
      email: "contato@example.com",
      telefone: "5133334444",
      cidade: "Porto Alegre",
    };
    let atualizado = false;
    cy.intercept("GET", "**/empresas*", (req) => {
      req.reply({
        statusCode: 200,
        body: req.query.cnpj
          ? [{ ...empresa, email: atualizado ? "novo@example.com" : empresa.email }]
          : [],
      });
    }).as("listarEmpresas");
    cy.intercept("PUT", "**/empresas/e2", (req) => {
      atualizado = true;
      req.reply({ statusCode: 200, body: { ...empresa, ...req.body } });
    }).as("atualizarEmpresa");

    cy.visit("/empresas.html");
    cy.wait("@listarEmpresas");
    cy.get("#busca-documento-empresa").type("12345678000199");
    cy.get("#form-busca-empresas").submit();
    cy.wait("@listarEmpresas");
    cy.contains(".card", "Tech Corp").contains("button", "Editar").click();
    cy.contains(".card", "Tech Corp").find('input[name="email"]').clear().type("novo@example.com");
    cy.contains(".card", "Tech Corp").contains("button", "Salvar alterações").click();
    cy.wait("@atualizarEmpresa").its("request.body").should("include", {
      cnpj: "12345678000199",
      cpf: "12345678900",
      email: "novo@example.com",
    });
    cy.wait("@listarEmpresas");
    cy.get("#alert-empresas").should("contain", "Empresa atualizada com sucesso");
  });
});
