const ProductService = require('../../src/services/productService');
const RequestManager = require('../../src/core/requestManager');
const TestContext = require('../../src/core/context');
const { generateUniqueProductName } = require('../../src/helpers/utils');

describe('Módulo 3 - Produtos (/produtos)', () => {
  beforeAll(async () => {
    const manager = RequestManager.getInstance();
    const loginRes = await manager.post('/login').send({
      email: 'fulano@qa.com',
      password: 'teste'
    });

    TestContext.set('authToken', loginRes.body.authorization);
  });

  beforeEach(() => {
    TestContext.set('nomeProduto', generateUniqueProductName());
  });

  afterEach(async () => {
    if (TestContext.has('produtoIdCriado')) {
      const id = TestContext.get('produtoIdCriado');
      const token = TestContext.get('authToken');
      await ProductService.excluir(id, token);
      TestContext.delete('produtoIdCriado');
    }
  });

  it('Deve cadastrar um novo produto com sucesso utilizando token de administrador (status 201)', async () => {
    const nomeProduto = TestContext.get('nomeProduto');
    const novoProduto = {
      nome: nomeProduto,
      preco: 350,
      descricao: 'Teclado Mecânico RGB Teste QA',
      quantidade: 50
    };

    const response = await ProductService.cadastrar(
      novoProduto,
      TestContext.get('authToken')
    ).expect(201);

    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.body).toHaveProperty('_id');

    TestContext.set('produtoIdCriado', response.body._id);
  });

  it('Deve buscar o produto cadastrado por ID (status 200)', async () => {
    const nomeProduto = TestContext.get('nomeProduto');
    const novoProduto = {
      nome: nomeProduto,
      preco: 420,
      descricao: 'Monitor Gamer Ultrawide Teste QA',
      quantidade: 15
    };

    const resCadastro = await ProductService.cadastrar(
      novoProduto,
      TestContext.get('authToken')
    ).expect(201);

    TestContext.set('produtoIdCriado', resCadastro.body._id);

    const response = await ProductService.buscarPorId(
      TestContext.get('produtoIdCriado')
    ).expect(200);

    expect(response.body).toHaveProperty('nome', nomeProduto);
    expect(response.body).toHaveProperty('preco', 420);
    expect(response.body).toHaveProperty('_id', TestContext.get('produtoIdCriado'));
  });

  it('Deve rejeitar o cadastro de produto sem token de autorização (status 401)', async () => {
    const produtoSemAuth = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto sem autorização',
      quantidade: 10
    };

    const response = await ProductService.cadastrar(produtoSemAuth).expect(401);

    expect(response.body).toHaveProperty(
      'message',
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
    );
  });

  it('Deve listar produtos cadastrados na ServeRest (status 200)', async () => {
    const response = await ProductService.listar().expect(200);

    expect(response.body).toHaveProperty('quantidade');
    expect(response.body).toHaveProperty('produtos');
    expect(Array.isArray(response.body.produtos)).toBe(true);
  });

  it('Deve rejeitar o cadastro de produto com nome já existente (status 400)', async () => {
    const nomeProduto = TestContext.get('nomeProduto');
    const produtoInicial = {
      nome: nomeProduto,
      preco: 199,
      descricao: 'Mouse Sem Fio QA',
      quantidade: 30
    };

    const resInicial = await ProductService.cadastrar(
      produtoInicial,
      TestContext.get('authToken')
    ).expect(201);

    TestContext.set('produtoIdCriado', resInicial.body._id);

    const resDuplicado = await ProductService.cadastrar(
      produtoInicial,
      TestContext.get('authToken')
    ).expect(400);

    expect(resDuplicado.body).toHaveProperty('message', 'Já existe produto com esse nome');
  });
});
