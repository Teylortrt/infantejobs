/**
 * Página de detalhes da vaga. Lê o `id` da querystring, busca a vaga e,
 * em seguida, os dados da empresa responsável. O botão "Candidatar-se"
 * leva ao formulário de candidatura já com a vaga pré-selecionada.
 */
(function () {
  "use strict";

  function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function renderizarRequisitos(requisitos) {
    if (!requisitos) return "<p>Nenhum requisito informado.</p>";
    const lista = Array.isArray(requisitos) ? requisitos : String(requisitos).split(",");
    const itens = lista
      .map((item) => item.toString().trim())
      .filter(Boolean)
      .map((item) => `<li>${UI.escapeHtml(item)}</li>`)
      .join("");
    return itens ? `<ul>${itens}</ul>` : "<p>Nenhum requisito informado.</p>";
  }

  async function carregarDetalhes() {
    const container = document.getElementById("detalhes-vaga");
    const id = obterIdDaUrl();

    if (!id) {
      container.innerHTML = "";
      UI.mostrarAlerta("alert-vaga", "Vaga não informada na URL.", "erro");
      return;
    }

    try {
      const vaga = await Api.vagas.obter(id);

      let empresa = null;
      if (vaga.empresaId) {
        try {
          empresa = await Api.empresas.obter(vaga.empresaId);
        } catch (erro) {
          empresa = null;
        }
      }

      container.innerHTML = `
        <div class="card">
          <h2>${UI.escapeHtml(vaga.titulo)}</h2>
          <p class="meta">
            ${UI.escapeHtml((empresa && empresa.nome) || "Empresa não informada")}
            &middot; ${UI.escapeHtml(vaga.cidade || "Cidade não informada")}
            &middot; ${UI.escapeHtml(vaga.modalidade || "—")}
          </p>
          <p>${UI.badgeStatusVaga(vaga.status)} &nbsp; <strong>${UI.formatarSalario(vaga.salario)}</strong></p>

          <h5>Descrição</h5>
          <p>${UI.escapeHtml(vaga.descricao || "Sem descrição.")}</p>

          <h5>Requisitos</h5>
          ${renderizarRequisitos(vaga.requisitos)}

          ${
            empresa
              ? `
          <h5>Sobre a empresa</h5>
          <p class="meta">
            E-mail: ${UI.escapeHtml(empresa.email || "—")} &middot;
            Telefone: ${UI.escapeHtml(empresa.telefone || "—")} &middot;
            Cidade: ${UI.escapeHtml(empresa.cidade || "—")}
          </p>`
              : ""
          }

          <a
            class="button button-primary"
            href="candidatura.html?vagaId=${encodeURIComponent(vaga.id || vaga._id)}"
            ${vaga.status === "FECHADA" ? 'aria-disabled="true" onclick="return false;" style="opacity:.5;cursor:not-allowed;"' : ""}
          >
            ${vaga.status === "FECHADA" ? "Vaga encerrada" : "Candidatar-se"}
          </a>
        </div>
      `;
    } catch (erro) {
      container.innerHTML = "";
      UI.mostrarAlerta("alert-vaga", UI.mensagemErro(erro), "erro");
    }
  }

  document.addEventListener("DOMContentLoaded", carregarDetalhes);
})();
