jest.mock('../src/models/Candidato', () => ({
    find: jest.fn()
}));

const Candidato = require('../src/models/Candidato');
const { listarCandidatos } = require('../src/controllers/candidatoController');

function criarResposta() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
}

describe('Busca de candidatos por CPF', () => {
    beforeEach(() => {
        Candidato.find.mockReset();
        Candidato.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue([])
        });
    });

    it('encontra CPF com ou sem formatação', async () => {
        const resposta = criarResposta();

        await listarCandidatos({ query: { cpf: '123.456.789-00' } }, resposta);

        const filtro = Candidato.find.mock.calls[0][0];
        expect(filtro.cpf.test('12345678900')).toBe(true);
        expect(filtro.cpf.test('123.456.789-00')).toBe(true);
        expect(resposta.status).toHaveBeenCalledWith(200);
    });

    it('rejeita busca por CPF com tamanho inválido', async () => {
        const resposta = criarResposta();

        await listarCandidatos({ query: { cpf: '1234' } }, resposta);

        expect(resposta.status).toHaveBeenCalledWith(400);
        expect(Candidato.find).not.toHaveBeenCalled();
    });
});
