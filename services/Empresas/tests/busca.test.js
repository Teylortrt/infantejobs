jest.mock('../src/models/Empresas', () => ({
    find: jest.fn()
}));

const Empresa = require('../src/models/Empresas');
const { listarEmpresas } = require('../src/controllers/EmpresasController');

function criarResposta() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
}

describe('Busca de empresas por documento', () => {
    beforeEach(() => {
        Empresa.find.mockReset();
        Empresa.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue([])
        });
    });

    it('encontra CPF do responsável com ou sem formatação', async () => {
        const resposta = criarResposta();

        await listarEmpresas({ query: { cpf: '123.456.789-00' } }, resposta);

        const filtro = Empresa.find.mock.calls[0][0];
        expect(filtro.cpf.test('12345678900')).toBe(true);
        expect(filtro.cpf.test('123.456.789-00')).toBe(true);
        expect(resposta.status).toHaveBeenCalledWith(200);
    });

    it('encontra CNPJ com formatação brasileira', async () => {
        const resposta = criarResposta();

        await listarEmpresas({ query: { cnpj: '12.345.678/0001-99' } }, resposta);

        const filtro = Empresa.find.mock.calls[0][0];
        expect(filtro.cnpj.test('12345678000199')).toBe(true);
        expect(filtro.cnpj.test('12.345.678/0001-99')).toBe(true);
        expect(resposta.status).toHaveBeenCalledWith(200);
    });

    it('rejeita busca por CPF com tamanho inválido', async () => {
        const resposta = criarResposta();

        await listarEmpresas({ query: { cpf: '1234' } }, resposta);

        expect(resposta.status).toHaveBeenCalledWith(400);
        expect(Empresa.find).not.toHaveBeenCalled();
    });
});
