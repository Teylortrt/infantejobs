/**
 * Lista de candidatos cadastrados, incluindo link para o currículo
 * quando informado e botão de exclusão.
 */
(function () {
  "use strict";

  async function excluirCandidato(id) {
    if (!window.confirm("Tem certeza que deseja excluir este candidato?")) return;
    try {
      await Api.candidatos.excluir(id);
      UI.mostrarAlerta("alert-candidatos", "Candidato excluído com sucesso.", "sucesso");
      carregarCandidatos();
    } catch (erro) {
      UI.mostrarAlerta("alert-candidatos", UI.mensagemErro(erro), "erro");
    }
  }

  function renderizarCandidatos(candidatos) {
    const container = document.getElementById("lista-candidatos");

    if (!candidatos || candidatos.length === 0) {
      container.innerHTML = '<p class="estado-info">Nenhum candidato cadastrado ainda.</p>';
      return;
    }

    container.innerHTML = candidatos
      .map((candidato) => {
        const id = candidato.id || candidato._id;
        const habilidades = Array.isArray(candidato.habilidades) ? candidato.habilidades : [];
        return `
          <div class="card">
            <h4>${UI.escapeHtml(candidato.nome)}</h4>
            <p class="meta">
              ${UI.escapeHtml(candidato.email)} &middot; ${UI.escapeHtml(candidato.telefone || "—")}
              &middot; ${UI.escapeHtml(candidato.cidade || "—")}
            </p>
            ${
              habilidades.length > 0
                ? `<p>${habilidades.map((h) => `<span class="badge status-enviada">${UI.escapeHtml(h)}</span>`).join(" ")}</p>`
                : ""
            }
            ${
              candidato.curriculoUrl
                ? `<p><a href="${UI.escapeHtml(candidato.curriculoUrl)}" target="_blank" rel="noopener noreferrer">Ver currículo</a></p>`
                : ""
            }
            <button class="button" data-acao="excluir" data-id="${UI.escapeHtml(id)}">Excluir</button>
          </div>
        `;
      })
      .join("");

    container.querySelectorAll('[data-acao="excluir"]').forEach((botao) => {
      botao.addEventListener("click", () => excluirCandidato(botao.dataset.id));
    });
  }

  async function carregarCandidatos() {
    const container = document.getElementById("lista-candidatos");
    container.innerHTML = '<p class="estado-info">Carregando candidatos...</p>';
    UI.esconderAlerta("alert-candidatos");

    try {
      const candidatos = await Api.candidatos.listar();
      renderizarCandidatos(Array.isArray(candidatos) ? candidatos : []);
    } catch (erro) {
      container.innerHTML = "";
      UI.mostrarAlerta("alert-candidatos", UI.mensagemErro(erro), "erro");
    }
  }

  document.addEventListener("DOMContentLoaded", carregarCandidatos);
})();
