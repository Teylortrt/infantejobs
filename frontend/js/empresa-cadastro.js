/**
 * Cadastro de empresa com validação client-side básica (mantém a UX
 * responsiva mesmo que a API também valide os mesmos campos no backend).
 */
(function () {
  "use strict";

  function apenasDigitos(valor) {
    return (valor || "").replace(/\D/g, "");
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor || "");
  }

  function marcarCampo(id, erroId, valido) {
    const campo = document.getElementById(id);
    const erro = document.getElementById(erroId);
    campo.classList.toggle("invalido", !valido);
    if (erro) erro.classList.toggle("visible", !valido);
    return valido;
  }

  function validarFormulario() {
    const nome = document.getElementById("nome").value.trim();
    const cnpj = apenasDigitos(document.getElementById("cnpj").value);
    const cpf = apenasDigitos(document.getElementById("cpf").value);
    const email = document.getElementById("email").value.trim();
    const cidade = document.getElementById("cidade").value.trim();

    const nomeOk = marcarCampo("nome", "erro-nome", nome.length > 0);
    const cnpjOk = marcarCampo("cnpj", "erro-cnpj", cnpj.length === 14);
    const cpfOk = marcarCampo("cpf", "erro-cpf", !cpf || cpf.length === 11);
    const emailOk = marcarCampo("email", "erro-email", emailValido(email));
    const cidadeOk = marcarCampo("cidade", "erro-cidade", cidade.length > 0);

    return nomeOk && cnpjOk && cpfOk && emailOk && cidadeOk;
  }

  async function enviarFormulario(ev) {
    ev.preventDefault();
    UI.esconderAlerta("alert-empresa");

    if (!validarFormulario()) {
      UI.mostrarAlerta("alert-empresa", "Corrija os campos destacados antes de continuar.", "erro");
      return;
    }

    const dados = {
      nome: document.getElementById("nome").value.trim(),
      cnpj: apenasDigitos(document.getElementById("cnpj").value),
      cpf: apenasDigitos(document.getElementById("cpf").value) || undefined,
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      cidade: document.getElementById("cidade").value.trim(),
    };

    const botao = ev.target.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
      await Api.empresas.criar(dados);
      UI.mostrarAlerta("alert-empresa", "Empresa cadastrada com sucesso!", "sucesso");
      document.getElementById("form-empresa").reset();
    } catch (erro) {
      UI.mostrarAlerta("alert-empresa", UI.mensagemErro(erro), "erro");
    } finally {
      botao.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-empresa").addEventListener("submit", enviarFormulario);
  });
})();
