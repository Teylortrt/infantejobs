/**
 * Busca, exibe e permite excluir empresas cadastradas.
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

  async function excluirEmpresa(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta empresa?")) return;
    try {
      await Api.empresas.excluir(id);
      if (await carregarEmpresas(criterioBuscaAtual)) {
        UI.mostrarAlerta("alert-empresas", "Empresa excluída com sucesso.", "sucesso");
      }
    } catch (erro) {
      UI.mostrarAlerta("alert-empresas", UI.mensagemErro(erro), "erro");
    }
  }

  function formularioEdicao(empresa) {
    return `
      <form class="form-edicao" data-id="${UI.escapeHtml(empresa.id || empresa._id)}" hidden>
        <label>Nome
          <input name="nome" value="${UI.escapeHtml(empresa.nome || "")}" required />
        </label>
        <label>CNPJ
          <input name="cnpj" value="${UI.escapeHtml(apenasDigitos(empresa.cnpj))}" inputmode="numeric" maxlength="18" required />
        </label>
        <label>CPF do responsável (opcional)
          <input name="cpf" value="${UI.escapeHtml(apenasDigitos(empresa.cpf))}" inputmode="numeric" maxlength="14" />
        </label>
        <label>E-mail
          <input name="email" type="email" value="${UI.escapeHtml(empresa.email || "")}" />
        </label>
        <label>Telefone
          <input name="telefone" value="${UI.escapeHtml(empresa.telefone || "")}" />
        </label>
        <label>Cidade
          <input name="cidade" value="${UI.escapeHtml(empresa.cidade || "")}" required />
        </label>
        <button type="submit" class="button-primary">Salvar alterações</button>
        <button type="button" class="button" data-acao="cancelar-edicao">Cancelar</button>
      </form>
    `;
  }

  async function salvarEmpresa(form) {
    const dadosForm = new FormData(form);
    const cnpj = apenasDigitos(dadosForm.get("cnpj"));
    const cpf = apenasDigitos(dadosForm.get("cpf"));
    if (cnpj.length !== 14 || (cpf && cpf.length !== 11)) {
      UI.mostrarAlerta(
        "alert-empresas",
        "Informe um CNPJ com 14 dígitos e, se preenchido, um CPF com 11 dígitos.",
        "erro"
      );
      return;
    }

    const dados = {
      nome: String(dadosForm.get("nome")).trim(),
      cnpj,
      cpf,
      email: String(dadosForm.get("email")).trim(),
      telefone: String(dadosForm.get("telefone")).trim(),
      cidade: String(dadosForm.get("cidade")).trim(),
    };
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
      await Api.empresas.atualizar(form.dataset.id, dados);
      if (criterioBuscaAtual.cpf) criterioBuscaAtual = cpf ? { cpf } : {};
      if (criterioBuscaAtual.cnpj) criterioBuscaAtual = { cnpj };
      if (await carregarEmpresas(criterioBuscaAtual)) {
        UI.mostrarAlerta("alert-empresas", "Empresa atualizada com sucesso.", "sucesso");
      }
    } catch (erro) {
      UI.mostrarAlerta("alert-empresas", UI.mensagemErro(erro), "erro");
    } finally {
      botao.disabled = false;
    }
  }

  function renderizarEmpresas(empresas) {
    const container = document.getElementById("lista-empresas");

    if (!empresas || empresas.length === 0) {
      container.innerHTML = '<p class="estado-info">Nenhuma empresa encontrada.</p>';
      return;
    }

    container.innerHTML = empresas
      .map((empresa) => {
        const id = empresa.id || empresa._id;
        return `
          <div class="card">
            <h4>${UI.escapeHtml(empresa.nome)}</h4>
            <p class="meta">
              CNPJ: ${UI.escapeHtml(empresa.cnpj || "—")}
              &middot; CPF do responsável: ${UI.escapeHtml(mascararCpf(empresa.cpf))}
            </p>
            <p class="meta">
              ${UI.escapeHtml(empresa.cidade || "—")}
              &middot; ${UI.escapeHtml(empresa.email || "—")}
              &middot; ${UI.escapeHtml(empresa.telefone || "—")}
            </p>
            <button class="button" data-acao="editar">Editar</button>
            <button class="button" data-acao="excluir" data-id="${UI.escapeHtml(id)}">Excluir</button>
            ${formularioEdicao(empresa)}
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
        salvarEmpresa(form);
      });
    });

    container.querySelectorAll('[data-acao="excluir"]').forEach((botao) => {
      botao.addEventListener("click", () => excluirEmpresa(botao.dataset.id));
    });
  }

  let criterioBuscaAtual = {};

  async function carregarEmpresas(params = {}) {
    const container = document.getElementById("lista-empresas");
    container.innerHTML = '<p class="estado-info">Carregando empresas...</p>';

    try {
      const empresas = await Api.empresas.listar(params);
      renderizarEmpresas(Array.isArray(empresas) ? empresas : []);
      return true;
    } catch (erro) {
      container.innerHTML = "";
      UI.mostrarAlerta("alert-empresas", UI.mensagemErro(erro), "erro");
      return false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const formBusca = document.getElementById("form-busca-empresas");
    const campoDocumento = document.getElementById("busca-documento-empresa");

    formBusca.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      UI.esconderAlerta("alert-empresas");
      const documento = apenasDigitos(campoDocumento.value);
      if (documento.length !== 11 && documento.length !== 14) {
        UI.mostrarAlerta("alert-empresas", "Informe um CPF com 11 dígitos ou um CNPJ com 14 dígitos.", "erro");
        return;
      }

      criterioBuscaAtual = documento.length === 11 ? { cpf: documento } : { cnpj: documento };
      await carregarEmpresas(criterioBuscaAtual);
    });

    formBusca.addEventListener("reset", () => {
      window.setTimeout(() => {
        criterioBuscaAtual = {};
        UI.esconderAlerta("alert-empresas");
        carregarEmpresas();
      }, 0);
    });

    carregarEmpresas();
  });
})();
