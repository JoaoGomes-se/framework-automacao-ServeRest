const request = require('supertest');
const { BASE_URL } = require('../../src/config/api');
const { generateUniqueEmail, generateUniqueProductName } = require('../../src/helpers/utils');

describe('Migração Módulo 4 - Carrinhos (/carrinhos)', () => {
  let userToken = '';
  let produtoId = '';

  beforeAll(async () => {
    // 1. Obter token de administrador para cadastrar produto
    const adminLogin = await request(BASE_URL)
      .post('/login')
      .send({ email: 'fulano@qa.com', password: 'teste' });
    const adminToken = adminLogin.body.authorization;

    // 2. Criar um produto específico com estoque disponível
    const prodRes = await request(BASE_URL)
      .post('/produtos')
      .set('Authorization', adminToken)
      .send({
        nome: generateUniqueProductName(),
        preco: 120,
        descricao: 'Item para teste de carrinho',
        quantidade: 10
      });
    produtoId = prodRes.body._id;

    // 3. Criar um usuário exclusivo para a compra (evitando conflito de carrinho já existente)
    const emailExclusivo = generateUniqueEmail();
    await request(BASE_URL)
      .post('/usuarios')
      .send({
        nome: 'Comprador QA Kaio',
        email: emailExclusivo,
        password: 'senhaSegura123',
        administrador: 'false'
      });

    // 4. Logar com o usuário comprador e obter o token dele
    const loginUser = await request(BASE_URL)
      .post('/login')
      .send({ email: emailExclusivo, password: 'senhaSegura123' });
    userToken = loginUser.body.authorization;
  });

  afterAll(async () => {
    // Limpeza preventiva pós-teste: cancelar o carrinho para liberar estado
    if (userToken) {
      await request(BASE_URL)
        .delete('/carrinhos/cancelar-compra')
        .set('Authorization', userToken);
    }
  });

  it('Deve cadastrar um carrinho com produto válido com sucesso (status 201)', async () => {
    const payloadCarrinho = {
      produtos: [
        {
          idProduto: produtoId,
          quantidade: 1
        }
      ]
    };

    const response = await request(BASE_URL)
      .post('/carrinhos')
      .set('Authorization', userToken)
      .send(payloadCarrinho)
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.body).toHaveProperty('_id');
    expect(typeof response.body._id).toBe('string');
  });

  it('Deve cancelar a compra do carrinho liberando estoque (status 200)', async () => {
    const response = await request(BASE_URL)
      .delete('/carrinhos/cancelar-compra')
      .set('Authorization', userToken)
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/Registro excluído com sucesso|Não foi encontrado carrinho/);
  });
});

