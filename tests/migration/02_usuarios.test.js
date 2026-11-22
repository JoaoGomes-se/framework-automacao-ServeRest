const UserService = require("../../src/services/userService");
const TestContext = require("../../src/core/context");
const { generateUniqueEmail } = require("../../src/helpers/utils");

describe("Módulo 2 - Usuários (/usuarios)", () => {
  beforeEach(() => {
    TestContext.clear();
    TestContext.set("novoEmail", generateUniqueEmail());
  });

  afterEach(async () => {
    if (TestContext.has("userIdCriado")) {
      const idParaExcluir = TestContext.get("userIdCriado");
      await UserService.excluir(idParaExcluir);
    }
    TestContext.clear();
  });

  it("Deve cadastrar um novo usuário com e-mail único (status 201)", async () => {
    const novoUsuario = {
      nome: "Kaio Teste QA",
      email: TestContext.get("novoEmail"),
      password: "senhaSegura123",
      administrador: "true",
    };

    const response = await UserService.cadastrar(novoUsuario).expect(201);

    expect(response.body).toHaveProperty("message", "Cadastro realizado com sucesso");
    expect(response.body).toHaveProperty("_id");
    expect(typeof response.body._id).toBe("string");

    TestContext.set("userIdCriado", response.body._id);
  });

  it("Deve buscar o usuário recém-criado por ID (status 200)", async () => {
    const email = TestContext.get("novoEmail");
    const responseCadastro = await UserService.cadastrar({
      nome: "Kaio Teste QA",
      email,
      password: "senhaSegura123",
      administrador: "true",
    }).expect(201);

    TestContext.set("userIdCriado", responseCadastro.body._id);

    const response = await UserService.buscarPorId(TestContext.get("userIdCriado")).expect(200);

    expect(response.body).toHaveProperty("nome", "Kaio Teste QA");
    expect(response.body).toHaveProperty("email", email);
    expect(response.body).toHaveProperty("_id", TestContext.get("userIdCriado"));
  });

  it("Deve falhar ao tentar cadastrar usuário com e-mail já existente (status 400)", async () => {
    const email = TestContext.get("novoEmail");
    const responseCadastro = await UserService.cadastrar({
      nome: "Kaio Teste QA",
      email,
      password: "senhaSegura123",
      administrador: "true",
    }).expect(201);

    TestContext.set("userIdCriado", responseCadastro.body._id);

    const usuarioDuplicado = {
      nome: "Usuario Duplicado",
      email,
      password: "qualquerSenha",
      administrador: "false",
    };

    const response = await UserService.cadastrar(usuarioDuplicado).expect(400);

    expect(response.body).toHaveProperty("message", "Este email já está sendo usado");
  });

  it("Deve listar usuários com status 200 e retornar array de usuários", async () => {
    const response = await UserService.listar().expect(200);

    expect(response.body).toHaveProperty("quantidade");
    expect(response.body).toHaveProperty("usuarios");
    expect(Array.isArray(response.body.usuarios)).toBe(true);
  });

  it("Deve excluir usuário recém-criado com sucesso (status 200)", async () => {
    const responseCadastro = await UserService.cadastrar({
      nome: "Kaio Para Deletar",
      email: generateUniqueEmail(),
      password: "senhaSegura123",
      administrador: "false",
    }).expect(201);

    const idCriado = responseCadastro.body._id;
    const responseDelete = await UserService.excluir(idCriado).expect(200);

    expect(responseDelete.body).toHaveProperty("message", "Registro excluído com sucesso");

    const responseGet = await UserService.buscarPorId(idCriado).expect(400);
    expect(responseGet.body).toHaveProperty("message", "Usuário não encontrado");
  });
});
