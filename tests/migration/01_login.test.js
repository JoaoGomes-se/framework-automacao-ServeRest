const request = require('supertest');
const { BASE_URL } = require('../../src/config/api');

describe('Migração Módulo 1 - Login (/login)', () => {
  it('Deve autenticar usuário administrador com sucesso e retornar token Bearer (status 200)', async () => {
    const credenciais = {
      email: 'fulano@qa.com',
      password: 'teste'
    };

    const response = await request(BASE_URL)
      .post('/login')
      .send(credenciais)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Login realizado com sucesso');
    expect(response.body).toHaveProperty('authorization');
    expect(response.body.authorization).toMatch(/^Bearer\s+/);
  });

  it('Deve rejeitar autenticação com senha inválida (status 401)', async () => {
    const credenciaisInvalidas = {
      email: 'fulano@qa.com',
      password: 'senha_incorreta_xyz'
    };

    const response = await request(BASE_URL)
      .post('/login')
      .send(credenciaisInvalidas)
      .set('Content-Type', 'application/json')
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Email e/ou senha inválidos');
  });
});

