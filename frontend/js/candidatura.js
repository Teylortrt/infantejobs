/**
 * Formulário de candidatura. A vaga pode vir pré-selecionada via
 * querystring (`?vagaId=...`) a partir da página de detalhes da vaga.
 */
(function () {
  "use strict";

  function obterVagaIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("vagaId");
  }

  async function carregarResumoVaga(vagaId) {
    const container = document.getElementById("resumo-vaga");
    if (!vagaId) {
      container.innerHTML = "";
      return;
    }
    try {
      const vaga = await Api.vagas.obter(vagaId);
      container.innerHTML = `
        <div class="card">
          <p class="meta">Você está se candidatando para:</p>
          <h4>${UI.escapeHtml(vaga.titulo)}</h4>
          <p>${UI.badgeStatusVaga(vaga.status)}</p>
        </div>
      `;
    } catch (erro) {
      container.innerHTML = "";
    }
  }

  async function carregarVagas(vagaIdSelecionada) {
    const select = document.getElementById("vagaId");
    try {
      const vagas = await Api.vagas.listar({ status: "ABERTA" });
      const lista = Array.isArray(vagas) ? vagas : [];

      if (lista.length === 0) {
        select.innerHTML = '<option value="">Nenhuma vaga aberta no momento</option>';
        return;
      }

      select.innerHTML =
        '<option value="">Selecione a vaga</option>' +
        lista
          .map((vaga) => {
            const id = vaga.id || vaga._id;
            const selecionado = vagaIdSelecionada && id === vagaIdSelecionada ? "selected" : "";
            return `<option value="${UI.escapeHtml(id)}" ${selecionado}>${UI.escapeHtml(vaga.titulo)}</option>`;
          })
          .join("");
    } catch (erro) {
      select.innerHTML = '<option value="">Erro ao carregar vagas</option>';
      UI.mostrarAlerta("alert-candidatura", UI.mensagemErro(erro), "erro");
    }
  }

  async function carregarCandidatos() {
    const select = document.getElementById("candidatoId");
    try {
      const candidatos = await Api.candidatos.listar();
      const lista = Array.isArray(candidatos) ? candidatos : [];

      if (lista.length === 0) {
        select.innerHTML = '<option value="">Nenhum candidato cadastrado</option>';
        return;
      }

      select.innerHTML =
        '<option value="">Selecione o candidato</option>' +
        lista
          .map((candidato) => {
            const id = candidato.id || candidato._id;
            return `<option value="${UI.escapeHtml(id)}">${UI.escapeHtml(candidato.nome)} (${UI.escapeHtml(candidato.email)})</option>`;
          })
          .join("");
    } catch (erro) {
      select.innerHTML = '<option value="">Erro ao carregar candidatos</option>';
      UI.mostrarAlerta("alert-candidatura", UI.mensagemErro(erro), "erro");
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
    const vagaId = document.getElementById("vagaId").value;
    const candidatoId = document.getElementById("candidatoId").value;

    const vagaOk = marcarCampo("vagaId", "erro-vagaId", vagaId.length > 0);
    const candidatoOk = marcarCampo("candidatoId", "erro-candidatoId", candidatoId.length > 0);

    return vagaOk && candidatoOk;
  }

  async function enviarFormulario(ev) {
    ev.preventDefault();
    UI.esconderAlerta("alert-candidatura");

    if (!validarFormulario()) {
      UI.mostrarAlerta("alert-candidatura", "Selecione a vaga e o candidato antes de continuar.", "erro");
      return;
    }

    const dados = {
      vagaId: document.getElementById("vagaId").value,
      candidatoId: document.getElementById("candidatoId").value,
      data: new Date().toISOString(),
      status: "ENVIADA",
    };

    const botao = ev.target.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
      await Api.candidaturas.criar(dados);
      UI.mostrarAlerta(
        "alert-candidatura",
        "Candidatura enviada com sucesso! Boa sorte no processo seletivo.",
        "sucesso"
      );
      document.getElementById("form-candidatura").reset();
    } catch (erro) {
      UI.mostrarAlerta("alert-candidatura", UI.mensagemErro(erro), "erro");
    } finally {
      botao.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const vagaId = obterVagaIdDaUrl();
    carregarResumoVaga(vagaId);
    carregarVagas(vagaId);
    carregarCandidatos();

    document.getElementById("form-candidatura").addEventListener("submit", enviarFormulario);
  });
})();
