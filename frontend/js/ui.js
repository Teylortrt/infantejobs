/**
 * Utilidades de UI compartilhadas entre todas as páginas:
 * - injeta o cabeçalho/rodapé padrão;
 * - exibe mensagens de sucesso/erro;
 * - formata status e dados comuns.
 */
(function () {
  "use strict";

  const PAGINAS = [
    { href: "index.html", label: "Home" },
    { href: "vagas.html", label: "Vagas" },
    { href: "candidatos.html", label: "Candidatos" },
    { href: "empresa-cadastro.html", label: "Cadastrar empresa" },
    { href: "vaga-cadastro.html", label: "Cadastrar vaga" },
    { href: "candidato-cadastro.html", label: "Cadastrar candidato" },
  ];

  function paginaAtual() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function montarCabecalho() {
    const montagem = document.getElementById("app-header");
    if (!montagem) return;

    const atual = paginaAtual();
    const links = PAGINAS.map(
      (p) =>
        `<a href="${p.href}" class="${p.href === atual ? "active" : ""}">${p.label}</a>`
    ).join("");

    montagem.innerHTML = `
      <div class="top-bar">
        <div class="container">
          <a class="brand" href="index.html">Vagas&amp;Carreiras</a>
          <nav>${links}</nav>
        </div>
      </div>
    `;
  }

  function montarRodape() {
    const montagem = document.getElementById("app-footer");
    if (!montagem) return;
    montagem.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          Projeto Integrador &mdash; Plataforma de Vagas e Candidaturas
        </div>
      </footer>
    `;
  }

  /** Exibe uma mensagem de alerta (sucesso ou erro) em um container #<alertId>. */
  function mostrarAlerta(alertId, mensagem, tipo) {
    const el = document.getElementById(alertId);
    if (!el) return;
    el.textContent = mensagem;
    el.className = `alert visible alert-${tipo === "erro" ? "error" : "success"}`;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function esconderAlerta(alertId) {
    const el = document.getElementById(alertId);
    if (!el) return;
    el.className = "alert";
  }

  const ROTULOS_STATUS_VAGA = { ABERTA: "Aberta", FECHADA: "Fechada" };
  const ROTULOS_STATUS_CANDIDATURA = {
    ENVIADA: "Enviada",
    EM_ANALISE: "Em análise",
    APROVADA: "Aprovada",
    REJEITADA: "Rejeitada",
  };

  function badgeStatusVaga(status) {
    const rotulo = ROTULOS_STATUS_VAGA[status] || status || "—";
    const classe = (status || "").toLowerCase();
    return `<span class="badge status-${classe}">${rotulo}</span>`;
  }

  function badgeStatusCandidatura(status) {
    const rotulo = ROTULOS_STATUS_CANDIDATURA[status] || status || "—";
    const classe = (status || "").toLowerCase();
    return `<span class="badge status-${classe}">${rotulo}</span>`;
  }

  function escapeHtml(valor) {
    const div = document.createElement("div");
    div.textContent = valor == null ? "" : String(valor);
    return div.innerHTML;
  }

  function formatarData(data) {
    if (!data) return "—";
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return String(data);
    return d.toLocaleDateString("pt-BR");
  }

  function formatarSalario(valor) {
    if (valor === undefined || valor === null || valor === "") return "A combinar";
    const numero = Number(valor);
    if (Number.isNaN(numero)) return String(valor);
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function mensagemErro(erro) {
    if (!erro) return "Ocorreu um erro inesperado.";
    if (erro.status === 0) return erro.message;
    if (erro.status === 400) return erro.message || "Dados inválidos. Verifique o formulário.";
    if (erro.status === 404) return "Registro não encontrado.";
    return erro.message || "Ocorreu um erro inesperado.";
  }

  document.addEventListener("DOMContentLoaded", () => {
    montarCabecalho();
    montarRodape();
  });

  window.UI = {
    mostrarAlerta,
    esconderAlerta,
    badgeStatusVaga,
    badgeStatusCandidatura,
    escapeHtml,
    formatarData,
    formatarSalario,
    mensagemErro,
  };
})();
