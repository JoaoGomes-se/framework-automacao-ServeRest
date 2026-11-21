const request = require('supertest');
const { BASE_URL } = require('../../src/config/api');
const { generateUniqueEmail } = require('../../src/helpers/utils');

describe('Migração Módulo 2 - Usuários (/usuarios)', () => {
  let userIdCriado = '';
  let novoEmail = '';

  beforeEach(() => {
    userIdCriado = '';
    novoEmail = generateUniqueEmail();
  });

  afterEach(async () => {
    if (userIdCriado) {
      await request(BASE_URL)
        .delete(`/usuarios/${userIdCriado}`)
        .expect(200);
    }
  });

  it('Deve cadastrar um novo usuário com e-mail único (status 201)', async () => {
    const novoUsuario = {
      nome: 'Kaio Teste QA',
      email: novoEmail,
      password: 'senhaSegura123',
      administrador: 'true'
    };

    const response = await request(BASE_URL)
      .post('/usuarios')
      .send(novoUsuario)
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.body).toHaveProperty('_id');
    expect(typeof response.body._id).toBe('string');

    userIdCriado = response.body._id;
  });

  it('Deve buscar o usuário recém-criado por ID (status 200)', async () => {
    const responseCadastro = await request(BASE_URL)
      .post('/usuarios')
      .send({
        nome: 'Kaio Teste QA',
        email: novoEmail,
        password: 'senhaSegura123',
        administrador: 'true'
      })
      .set('Content-Type', 'application/json')
      .expect(201);

    userIdCriado = responseCadastro.body._id;

    const response = await request(BASE_URL)
      .get(`/usuarios/${userIdCriado}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toHaveProperty('nome', 'Kaio Teste QA');
    expect(response.body).toHaveProperty('email', novoEmail);
    expect(response.body).toHaveProperty('_id', userIdCriado);
  });

  it('Deve falhar ao tentar cadastrar usuário com e-mail já existente (status 400)', async () => {
    const responseCadastro = await request(BASE_URL)
      .post('/usuarios')
      .send({
        nome: 'Kaio Teste QA',
        email: novoEmail,
        password: 'senhaSegura123',
        administrador: 'true'
      })
      .set('Content-Type', 'application/json')
      .expect(201);

    userIdCriado = responseCadastro.body._id;

    const usuarioDuplicado = {
      nome: 'Usuario Duplicado',
      email: novoEmail,
      password: 'qualquerSenha',
      administrador: 'false'
    };

    const response = await request(BASE_URL)
      .post('/usuarios')
      .send(usuarioDuplicado)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Este email já está sendo usado');
  });
});
