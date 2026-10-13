/**
 * Cadastro de candidato, incluindo o desafio extra de "currículo via URL".
 */
(function () {
  "use strict";

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor || "");
  }

  function urlValida(valor) {
    if (!valor) return true; // campo opcional
    try {
      new URL(valor);
      return true;
    } catch (e) {
      return false;
    }
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
    const email = document.getElementById("email").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const curriculoUrl = document.getElementById("curriculoUrl").value.trim();

    const nomeOk = marcarCampo("nome", "erro-nome", nome.length > 0);
    const emailOk = marcarCampo("email", "erro-email", emailValido(email));
    const cidadeOk = marcarCampo("cidade", "erro-cidade", cidade.length > 0);
    const curriculoOk = marcarCampo("curriculoUrl", "erro-curriculoUrl", urlValida(curriculoUrl));

    return nomeOk && emailOk && cidadeOk && curriculoOk;
  }

  async function enviarFormulario(ev) {
    ev.preventDefault();
    UI.esconderAlerta("alert-candidato");

    if (!validarFormulario()) {
      UI.mostrarAlerta("alert-candidato", "Corrija os campos destacados antes de continuar.", "erro");
      return;
    }

    const habilidadesTexto = document.getElementById("habilidades").value.trim();
    const dados = {
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      cidade: document.getElementById("cidade").value.trim(),
      habilidades: habilidadesTexto
        ? habilidadesTexto.split(",").map((h) => h.trim()).filter(Boolean)
        : [],
      curriculoUrl: document.getElementById("curriculoUrl").value.trim() || undefined,
    };

    const botao = ev.target.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
      await Api.candidatos.criar(dados);
      UI.mostrarAlerta("alert-candidato", "Candidato cadastrado com sucesso!", "sucesso");
      document.getElementById("form-candidato").reset();
    } catch (erro) {
      UI.mostrarAlerta("alert-candidato", UI.mensagemErro(erro), "erro");
    } finally {
      botao.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-candidato").addEventListener("submit", enviarFormulario);
  });
})();
