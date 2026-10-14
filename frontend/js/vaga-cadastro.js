/**
 * Cadastro de vaga. Carrega a lista de empresas para popular o select
 * de "empresa responsável" e envia os requisitos como array de strings.
 */
(function () {
  "use strict";

  async function carregarEmpresas() {
    const select = document.getElementById("empresaId");
    try {
      const empresas = await Api.empresas.listar();
      if (!Array.isArray(empresas) || empresas.length === 0) {
        select.innerHTML = '<option value="">Nenhuma empresa cadastrada</option>';
        return;
      }
      select.innerHTML =
        '<option value="">Selecione</option>' +
        empresas
          .map(
            (empresa) =>
              `<option value="${UI.escapeHtml(empresa.id || empresa._id)}">${UI.escapeHtml(empresa.nome)}</option>`
          )
          .join("");
    } catch (erro) {
      select.innerHTML = '<option value="">Erro ao carregar empresas</option>';
      UI.mostrarAlerta("alert-vaga", UI.mensagemErro(erro), "erro");
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
    const titulo = document.getElementById("titulo").value.trim();
    const empresaId = document.getElementById("empresaId").value;
    const descricao = document.getElementById("descricao").value.trim();
    const modalidade = document.getElementById("modalidade").value;
    const cidade = document.getElementById("cidade").value.trim();

    const tituloOk = marcarCampo("titulo", "erro-titulo", titulo.length > 0);
    const empresaOk = marcarCampo("empresaId", "erro-empresaId", empresaId.length > 0);
    const descricaoOk = marcarCampo("descricao", "erro-descricao", descricao.length > 0);
    const modalidadeOk = marcarCampo("modalidade", "erro-modalidade", modalidade.length > 0);
    const cidadeOk = marcarCampo("cidade", "erro-cidade", cidade.length > 0);

    return tituloOk && empresaOk && descricaoOk && modalidadeOk && cidadeOk;
  }

  async function enviarFormulario(ev) {
    ev.preventDefault();
    UI.esconderAlerta("alert-vaga");

    if (!validarFormulario()) {
      UI.mostrarAlerta("alert-vaga", "Corrija os campos destacados antes de continuar.", "erro");
      return;
    }

    const requisitosTexto = document.getElementById("requisitos").value.trim();
    const dados = {
      titulo: document.getElementById("titulo").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      salario: document.getElementById("salario").value
        ? Number(document.getElementById("salario").value)
        : undefined,
      modalidade: document.getElementById("modalidade").value,
      cidade: document.getElementById("cidade").value.trim(),
      requisitos: requisitosTexto
        ? requisitosTexto.split(",").map((r) => r.trim()).filter(Boolean)
        : [],
      empresaId: document.getElementById("empresaId").value,
      status: document.getElementById("status").value || "ABERTA",
    };

    const botao = ev.target.querySelector('button[type="submit"]');
    botao.disabled = true;

    try {
      await Api.vagas.criar(dados);
      UI.mostrarAlerta("alert-vaga", "Vaga publicada com sucesso!", "sucesso");
      document.getElementById("form-vaga").reset();
      carregarEmpresas();
    } catch (erro) {
      UI.mostrarAlerta("alert-vaga", UI.mensagemErro(erro), "erro");
    } finally {
      botao.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    carregarEmpresas();
    document.getElementById("form-vaga").addEventListener("submit", enviarFormulario);
  });
})();
