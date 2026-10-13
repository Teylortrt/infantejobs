/**
 * Home: exibe um resumo (dashboard simples) com totais de vagas,
 * empresas e candidatos. Cada bloco falha de forma independente para
 * que a indisponibilidade de um microserviço não quebre a página toda.
 */
(function () {
  "use strict";

  async function carregarTotalVagas() {
    const el = document.getElementById("total-vagas");
    try {
      const vagas = await Api.vagas.listar({ status: "ABERTA" });
      el.textContent = Array.isArray(vagas) ? vagas.length : "0";
    } catch (erro) {
      el.textContent = "—";
    }
  }

  async function carregarTotalEmpresas() {
    const el = document.getElementById("total-empresas");
    try {
      const empresas = await Api.empresas.listar();
      el.textContent = Array.isArray(empresas) ? empresas.length : "0";
    } catch (erro) {
      el.textContent = "—";
    }
  }

  async function carregarTotalCandidatos() {
    const el = document.getElementById("total-candidatos");
    try {
      const candidatos = await Api.candidatos.listar();
      el.textContent = Array.isArray(candidatos) ? candidatos.length : "0";
    } catch (erro) {
      el.textContent = "—";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    carregarTotalVagas();
    carregarTotalEmpresas();
    carregarTotalCandidatos();
  });
})();
