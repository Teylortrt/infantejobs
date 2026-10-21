/**
 * Lista de candidatos cadastrados, incluindo link para o currículo
 * quando informado e botão de exclusão.
 */
(function () {
  "use strict";

  function apenasDigitos(valor) {
    return (valor || "").replace(/\D/g, "");
  }

  function mascararCpf(cpf) {
    const digitos = apenasDigitos(cpf);
    return digitos.length === 11
      ? `***.***.${digitos.slice(6, 9)}-${digitos.slice(9)}`
      : cpf || "—";
  }

  let criterioBuscaAtual = {};

  async function excluirCandidato(id) {
    if (!window.confirm("Tem certeza que deseja excluir este candidato?")) return;
    try {
      await Api.candidatos.excluir(id);
      if (await carregarCandidatos(criterioBuscaAtual)) {
        UI.mostrarAlerta("alert-candidatos", "Candidato excluído com sucesso.", "sucesso");
      }
    } catch (erro) {
      UI.mostrarAlerta("alert-candidatos", UI.mensagemErro(erro), "erro");
    }
  }

  function formularioEdicao(candidato) {
    const habilidades = Array.isArray(candidato.habilidades) ? candidato.habilidades.join(", ") : "";
    return `
      <form class="form-edicao" data-id="${UI.escapeHtml(candidato.id || candidato._id)}" hidden>
        <label>Nome
          <input name="nome" value="${UI.escapeHtml(candidato.nome || "")}" required />
        </label>
        <label>CPF
          <input name="cpf" value="${UI.escapeHtml(apenasDigitos(candidato.cpf))}" inputmode="numeric" maxlength="14" required />
        </label>
        <label>E-mail
          <input name="email" type="email" value="${UI.escapeHtml(candidato.email || "")}" required />
        </label>
        <label>Telefone
          <input name="telefone" value="${UI.escapeHtml(candidato.telefone || "")}" required />
        </label>
        <label>Cidade
          <input name="cidade" value="${UI.escapeHtml(candidato.cidade || "")}" required />
        </label>
        <label>Habilidades (separadas por vírgula)
          <input name="habilidades" value="${UI.escapeHtml(habilidades)}" />
        </label>
        <button type="submit" class="button-primary">Salvar alterações</button>
        <button type="button" class="button" data-acao="cancelar-edicao">Cancelar</button>
      </form>
    `;
  }

  async function salvarCandidato(form) {
    const dadosForm = new FormData(form);
    const cpf = apenasDigitos(dadosForm.get("cpf"));
    if (cpf.length !== 11) {
      UI.mostrarAlerta("alert-candidatos", "Informe um CPF com 11 dígitos.", "erro");
      return;
    }

    const dados = {
      nome: String(dadosForm.get("nome")).trim(),
      cpf,
      email: String(dadosForm.get("email")).trim(),
      telefone: String(dadosForm.get("telefone")).trim(),
      cidade: String(dadosForm.get("cidade")).trim(),
      habilidades: String(dadosForm.get("habilidades"))
        .split(",")
        .map((habilidade) => habilidade.trim())
        .filter(Boolean),
    };
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
      await Api.candidatos.atualizar(form.dataset.id, dados);
      if (criterioBuscaAtual.cpf) criterioBuscaAtual = { cpf };
      if (await carregarCandidatos(criterioBuscaAtual)) {
        UI.mostrarAlerta("alert-candidatos", "Candidato atualizado com sucesso.", "sucesso");
      }
    } catch (erro) {
      UI.mostrarAlerta("alert-candidatos", UI.mensagemErro(erro), "erro");
    } finally {
      botao.disabled = false;
    }
  }

  function renderizarCandidatos(candidatos) {
    const container = document.getElementById("lista-candidatos");

    if (!candidatos || candidatos.length === 0) {
      container.innerHTML = '<p class="estado-info">Nenhum candidato encontrado.</p>';
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
            <p class="meta">CPF: ${UI.escapeHtml(mascararCpf(candidato.cpf))}</p>
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
            <button class="button" data-acao="editar">Editar</button>
            <button class="button" data-acao="excluir" data-id="${UI.escapeHtml(id)}">Excluir</button>
            ${formularioEdicao(candidato)}
          </div>
        `;
      })
      .join("");

    container.querySelectorAll('[data-acao="editar"]').forEach((botao) => {
      botao.addEventListener("click", () => {
        const card = botao.closest(".card");
        botao.hidden = true;
        card.querySelector(".form-edicao").hidden = false;
      });
    });

    container.querySelectorAll('[data-acao="cancelar-edicao"]').forEach((botao) => {
      botao.addEventListener("click", () => {
        const card = botao.closest(".card");
        card.querySelector(".form-edicao").hidden = true;
        card.querySelector('[data-acao="editar"]').hidden = false;
      });
    });

    container.querySelectorAll(".form-edicao").forEach((form) => {
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        salvarCandidato(form);
      });
    });

    container.querySelectorAll('[data-acao="excluir"]').forEach((botao) => {
      botao.addEventListener("click", () => excluirCandidato(botao.dataset.id));
    });
  }

  async function carregarCandidatos(params = {}) {
    const container = document.getElementById("lista-candidatos");
    container.innerHTML = '<p class="estado-info">Carregando candidatos...</p>';

    try {
      const candidatos = await Api.candidatos.listar(params);
      renderizarCandidatos(Array.isArray(candidatos) ? candidatos : []);
      return true;
    } catch (erro) {
      container.innerHTML = "";
      UI.mostrarAlerta("alert-candidatos", UI.mensagemErro(erro), "erro");
      return false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const formBusca = document.getElementById("form-busca-candidatos");
    const campoCpf = document.getElementById("busca-cpf");

    formBusca.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      UI.esconderAlerta("alert-candidatos");
      const cpf = apenasDigitos(campoCpf.value);
      if (cpf.length !== 11) {
        UI.mostrarAlerta("alert-candidatos", "Informe um CPF com 11 dígitos.", "erro");
        return;
      }
      criterioBuscaAtual = { cpf };
      await carregarCandidatos(criterioBuscaAtual);
    });

    formBusca.addEventListener("reset", () => {
      window.setTimeout(() => {
        criterioBuscaAtual = {};
        UI.esconderAlerta("alert-candidatos");
        carregarCandidatos();
      }, 0);
    });

    carregarCandidatos();
  });
})();
