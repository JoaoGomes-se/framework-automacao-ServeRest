const request = require('supertest');
const { BASE_URL } = require('../../src/config/api');
const { generateUniqueProductName } = require('../../src/helpers/utils');

describe('Migração Módulo 3 - Produtos (/produtos)', () => {
  let authToken = '';
  let produtoIdCriado = '';
  const nomeProduto = generateUniqueProductName();

  beforeAll(async () => {
    // Obter token de autorização como pré-condição
    const loginRes = await request(BASE_URL)
      .post('/login')
      .send({
        email: 'fulano@qa.com',
        password: 'teste'
      })
      .set('Content-Type', 'application/json');

    authToken = loginRes.body.authorization;
  });

  it('Deve cadastrar um novo produto com sucesso utilizando token de administrador (status 201)', async () => {
    const novoProduto = {
      nome: nomeProduto,
      preco: 350,
      descricao: 'Teclado Mecânico RGB Teste QA',
      quantidade: 50
    };

    const response = await request(BASE_URL)
      .post('/produtos')
      .set('Authorization', authToken)
      .send(novoProduto)
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.body).toHaveProperty('_id');

    produtoIdCriado = response.body._id;
  });

  it('Deve buscar o produto cadastrado por ID (status 200)', async () => {
    const response = await request(BASE_URL)
      .get(`/produtos/${produtoIdCriado}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('nome', nomeProduto);
    expect(response.body).toHaveProperty('preco', 350);
    expect(response.body).toHaveProperty('_id', produtoIdCriado);
  });

  it('Deve rejeitar o cadastro de produto sem token de autorização (status 401)', async () => {
    const produtoSemAuth = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto sem autorização',
      quantidade: 10
    };

    const response = await request(BASE_URL)
      .post('/produtos')
      .send(produtoSemAuth)
      .set('Content-Type', 'application/json')
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });
});

