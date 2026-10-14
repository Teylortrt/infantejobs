/**
 * Lista de vagas com filtros por título, cidade, modalidade e empresa.
 * Os filtros são enviados como query params para a API (busca server-side);
 * caso a API ainda não implemente algum filtro, aplicamos um filtro
 * adicional no cliente para não quebrar a experiência de busca.
 */
(function () {
  "use strict";

  const cacheEmpresas = new Map();

  async function nomeDaEmpresa(empresaId) {
    if (!empresaId) return "Empresa não informada";
    if (cacheEmpresas.has(empresaId)) return cacheEmpresas.get(empresaId);
    try {
      const empresa = await Api.empresas.obter(empresaId);
      const nome = (empresa && empresa.nome) || "Empresa";
      cacheEmpresas.set(empresaId, nome);
      return nome;
    } catch (erro) {
      cacheEmpresas.set(empresaId, "Empresa não encontrada");
      return "Empresa não encontrada";
    }
  }

  function lerFiltros() {
    return {
      titulo: document.getElementById("filtro-titulo").value.trim(),
      cidade: document.getElementById("filtro-cidade").value.trim(),
      modalidade: document.getElementById("filtro-modalidade").value,
      empresa: document.getElementById("filtro-empresa").value.trim(),
    };
  }

  function aplicarFiltroLocal(vagas, filtros) {
    return vagas.filter((vaga) => {
      const titulo = (vaga.titulo || "").toLowerCase();
      const cidade = (vaga.cidade || "").toLowerCase();
      const modalidade = (vaga.modalidade || "").toLowerCase();

      if (filtros.titulo && !titulo.includes(filtros.titulo.toLowerCase())) return false;
      if (filtros.cidade && !cidade.includes(filtros.cidade.toLowerCase())) return false;
      if (filtros.modalidade && modalidade !== filtros.modalidade.toLowerCase()) return false;
      return true;
    });
  }

  async function renderizarVagas(vagas, filtros) {
    const container = document.getElementById("lista-vagas");

    if (!vagas || vagas.length === 0) {
      container.innerHTML = '<p class="estado-info">Nenhuma vaga encontrada com os filtros informados.</p>';
      return;
    }

    const cards = await Promise.all(
      vagas.map(async (vaga) => {
        let empresaNome = await nomeDaEmpresa(vaga.empresaId);

        // filtro de empresa por nome é aplicado aqui pois depende de um
        // segundo fetch (empresaId -> nome da empresa)
        if (
          filtros.empresa &&
          !empresaNome.toLowerCase().includes(filtros.empresa.toLowerCase())
        ) {
          return "";
        }

        return `
          <div class="card">
            <h4>${UI.escapeHtml(vaga.titulo)}</h4>
            <p class="meta">
              ${UI.escapeHtml(empresaNome)} &middot; ${UI.escapeHtml(vaga.cidade || "Cidade não informada")}
              &middot; ${UI.escapeHtml(vaga.modalidade || "—")}
            </p>
            <p>${UI.escapeHtml((vaga.descricao || "").slice(0, 160))}${(vaga.descricao || "").length > 160 ? "..." : ""}</p>
            <p>${UI.badgeStatusVaga(vaga.status)} &nbsp; <strong>${UI.formatarSalario(vaga.salario)}</strong></p>
            <a class="button button-primary" href="vaga-detalhes.html?id=${encodeURIComponent(vaga.id || vaga._id)}">
              Ver detalhes
            </a>
          </div>
        `;
      })
    );

    const cardsFiltrados = cards.filter(Boolean);
    container.innerHTML =
      cardsFiltrados.length > 0
        ? cardsFiltrados.join("")
        : '<p class="estado-info">Nenhuma vaga encontrada com os filtros informados.</p>';
  }

  async function carregarVagas() {
    const container = document.getElementById("lista-vagas");
    container.innerHTML = '<p class="estado-info">Carregando vagas...</p>';
    UI.esconderAlerta("alert-vagas");

    const filtros = lerFiltros();

    try {
      const vagas = await Api.vagas.listar({
        titulo: filtros.titulo || undefined,
        cidade: filtros.cidade || undefined,
        modalidade: filtros.modalidade || undefined,
      });

      const lista = Array.isArray(vagas) ? vagas : [];
      const listaFiltrada = aplicarFiltroLocal(lista, filtros);
      await renderizarVagas(listaFiltrada, filtros);
    } catch (erro) {
      container.innerHTML = "";
      UI.mostrarAlerta("alert-vagas", UI.mensagemErro(erro), "erro");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    carregarVagas();

    document.getElementById("form-filtros").addEventListener("submit", (ev) => {
      ev.preventDefault();
      carregarVagas();
    });

    document.getElementById("btn-limpar-filtros").addEventListener("click", () => {
      document.getElementById("form-filtros").reset();
      carregarVagas();
    });
  });
})();
