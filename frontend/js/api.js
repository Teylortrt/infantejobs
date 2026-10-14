/**
 * Camada central de acesso à API dos microserviços.
 *
 * O backend é dividido em microserviços independentes (empresas, vagas,
 * candidatos e candidaturas). Enquanto o backend oficial não está pronto,
 * basta ajustar as URLs abaixo (ou as variáveis no localStorage, veja
 * `config.html` / instruções no README) para apontar para os serviços reais.
 *
 * Todas as páginas do frontend devem consumir a API exclusivamente através
 * das funções exportadas em `window.Api`, nunca chamando `fetch()` direto,
 * para que a troca de ambiente (mock -> real) não exija alterações em mais
 * de um lugar.
 */
(function () {
  "use strict";

  // Permite sobrescrever as URLs em tempo de execução via localStorage,
  // sem precisar editar o código (útil para apontar para o ambiente da
  // equipe assim que o backend estiver disponível).
  function readOverride(key, fallback) {
    try {
      return window.localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  const API_BASE = {
    empresas: readOverride("API_BASE_EMPRESAS", "http://localhost:3001"),
    vagas: readOverride("API_BASE_VAGAS", "http://localhost:3002"),
    candidatos: readOverride("API_BASE_CANDIDATOS", "http://localhost:3003"),
    candidaturas: readOverride("API_BASE_CANDIDATURAS", "http://localhost:3004"),
  };

  /**
   * Executa uma requisição HTTP e normaliza erros.
   * Lança um Error com `status` e `message` amigáveis em caso de falha.
   */
  async function request(url, options = {}) {
    let response;
    try {
      response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });
    } catch (networkError) {
      const err = new Error(
        "Não foi possível conectar à API. Verifique se o serviço está rodando em " + url
      );
      err.cause = networkError;
      err.status = 0;
      throw err;
    }

    const isJson = (response.headers.get("content-type") || "").includes("application/json");
    const body = isJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
      const message = (body && (body.message || body.error)) || `Erro HTTP ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      err.details = body;
      throw err;
    }

    return body;
  }

  function buildQuery(params) {
    if (!params) return "";
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
    if (entries.length === 0) return "";
    const search = new URLSearchParams(entries);
    return "?" + search.toString();
  }

  const Api = {
    base: API_BASE,

    // ---------- Empresas ----------
    empresas: {
      listar: (params) => request(`${API_BASE.empresas}/empresas${buildQuery(params)}`),
      obter: (id) => request(`${API_BASE.empresas}/empresas/${id}`),
      criar: (dados) =>
        request(`${API_BASE.empresas}/empresas`, { method: "POST", body: JSON.stringify(dados) }),
      atualizar: (id, dados) =>
        request(`${API_BASE.empresas}/empresas/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
      excluir: (id) => request(`${API_BASE.empresas}/empresas/${id}`, { method: "DELETE" }),
    },

    // ---------- Vagas ----------
    vagas: {
      listar: (params) => request(`${API_BASE.vagas}/vagas${buildQuery(params)}`),
      obter: (id) => request(`${API_BASE.vagas}/vagas/${id}`),
      criar: (dados) => request(`${API_BASE.vagas}/vagas`, { method: "POST", body: JSON.stringify(dados) }),
      atualizar: (id, dados) =>
        request(`${API_BASE.vagas}/vagas/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
      excluir: (id) => request(`${API_BASE.vagas}/vagas/${id}`, { method: "DELETE" }),
    },

    // ---------- Candidatos ----------
    candidatos: {
      listar: (params) => request(`${API_BASE.candidatos}/candidatos${buildQuery(params)}`),
      obter: (id) => request(`${API_BASE.candidatos}/candidatos/${id}`),
      criar: (dados) =>
        request(`${API_BASE.candidatos}/candidatos`, { method: "POST", body: JSON.stringify(dados) }),
      atualizar: (id, dados) =>
        request(`${API_BASE.candidatos}/candidatos/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
      excluir: (id) => request(`${API_BASE.candidatos}/candidatos/${id}`, { method: "DELETE" }),
    },

    // ---------- Candidaturas ----------
    candidaturas: {
      listar: (params) => request(`${API_BASE.candidaturas}/candidaturas${buildQuery(params)}`),
      obter: (id) => request(`${API_BASE.candidaturas}/candidaturas/${id}`),
      criar: (dados) =>
        request(`${API_BASE.candidaturas}/candidaturas`, {
          method: "POST",
          body: JSON.stringify(dados),
        }),
      atualizar: (id, dados) =>
        request(`${API_BASE.candidaturas}/candidaturas/${id}`, {
          method: "PUT",
          body: JSON.stringify(dados),
        }),
      excluir: (id) => request(`${API_BASE.candidaturas}/candidaturas/${id}`, { method: "DELETE" }),
    },
  };

  window.Api = Api;
})();
