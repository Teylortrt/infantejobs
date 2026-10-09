const mongoose = require('mongoose');
const Vaga = require('../models/Vagas');
const { buscarEmpresaPorId } = require('../services/empresaClient');
// Cionexao com vagas



// GET /vagas  (aceita filtros: ?status=ABERTA&modalidade=Remoto)
const listarVagas = async (req, res) => {
    try {
        const { status, modalidade, cidade, empresaId} = req.query;
        const filtro = {};
        if (status) filtro.status = status;
        if (modalidade) filtro.modalidade = modalidade;
        if (cidade) filtro.cidade = cidade;
        if (empresaId) filtro.empresaId = empresaId;

        const vagas = await Vaga.find(filtro).sort({ createdAt: -1 });
        return res.status(200).json(vagas);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao buscar vagas' });
    }
}


//GET /vagas/:id
const buscarVagaPorId = async (req, res) => {
    try{
        //verifica se o ID existe no BD
        const {id} = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({erro: 'ID inválido'});
        }

        // caso não ache o id da vaga
        const vaga = await Vaga.findById(id);
        if (!vaga) {
            return res.status(404).json({erro: 'Vaga não encontrada'});
        }

        /* ESPERARA SERVICE EMPRESA ESTAR PRONTO

        // tenta buscar a empresa no serviço :3001
        let empresa = null;
        try {
            empresa = await buscarEmpresaPorId(vaga.empresaId);
        } catch {
            console.warn ('Serviço de empresas fora do ar ou empresa não encontrada');
        }
        */

        // retorna a vaga em json
        return res.status(200).json(vaga)

    } catch (erro) {
        console.log(erro)
        return res.status(500).json({erro: 'Erro ao buscar vaga'})
    }
}

//POST /vagas
const criarVaga = async (req, res) => {
    try {
        const { empresaId } = req.body;
        if (!empresaId) {
            return res.status(400).json({erro: 'empresaId é obrifatório'});
        }

        /* Filtro de buscar empresa: precisa do service de empresa pronto

        const empresa = await buscarEmpresaPorId(empresaId);
        if (!empresa) {
            return res.status(400).json({ erro: 'Empresa informada não existe' });
    }
    */


        const novaVaga = await Vaga.create(req.body);
        return res.status(201).json(novaVaga);
    } catch (erro){
        if (erro.code === 'EMPRESAS_INDISPONIVEL') {
            return res.status(503).json({erro: 'Serviço de empresas indisponível, tente novamente'})
        }
        //validadtion error = faltou campo obrigatorio, enum errado, etc
        return res.status(400).json({erro: 'Dados invalidos', detalhes: erro.message});
    }
} 


// PUT /vagas/:id
const atualizarVaga = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({erro: 'ID inválido'});
        }
        
        const vaga = await Vaga.findByIdAndUpdate(id, req.body, {
            returnDocument: 'after',    // devolve o documento já atualizado
            runValidators: true         // aplica as validações do Schema também no update
        });

        if(!vaga) {
            return res.status(404).json({ erro: 'Vaga não encontrada'});
        }
        
        return res.status(200).json(vaga);
    } catch (erro) {
         return res.status(400).json({ erro: 'Dados inválidos', detalhes: erro.message });
  }
};


// PATCH /vagas/:id/fechar  (regra de ciclo de vida: ABERTA → FECHADA)
const fecharVaga = async (req, res) => {
    try{
        const {id} = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({erro: 'ID inválido'})
        }

        const vaga = await Vaga.findById(id);
        if(!vaga) {
            return res.status(404).json({erro: 'Vaga não encontrada'})
        }
        if(vaga.status == 'FECHADA') {
            return res.status(409).json({erro: 'A vaga já está fechada'});
        }

        vaga.status = 'FECHADA';
        await vaga.save();
        return res.status(200).json(vaga);

    } catch(erro){
        console.error(erro)
        return res.status(500).json({erro: 'Erro ao fechar a vaga'});
    }
}


// DELETE /vagas/:id
const removerVaga = async (req, res) => {
    try{
        const {id} = req.params;
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({erro: 'ID inválido'})
        }

        const vaga = await Vaga.findByIdAndDelete(id);
        if (!vaga) {
            return res.status(404).json({erro: "Vaga não encontrada"})
        }
        return res.status(204).send(); // 204 = sucesso, sem corpo


    } catch(erro){
        console.error(erro)
        return res.status(500).json({erro: 'Erro ao remover a vaga'})
    }

}

//exportar funções
module.exports = {
    listarVagas,
    buscarVagaPorId,
    criarVaga,
    atualizarVaga,
    fecharVaga,
    removerVaga

}