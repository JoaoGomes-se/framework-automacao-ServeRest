const AuthService = require("../../src/services/authService");
const userService = require("../../src/services/userService");
const TestContext = require("../../src/core/context");
const { CREDENTIALS } = require("../../src/config/api");
const { generateUniqueEmail } = require("../../src/helpers/utils");
const { logger } = require("../../src/core/logger");

describe("Migração Módulo 1 - Login (/login)", () => {
  const authService = new AuthService();

  beforeAll(async () => {
    TestContext.clear();
    const emailAdmin = generateUniqueEmail();
    const resUser = await userService.cadastrar({
      nome: "Admin Login QA",
      email: emailAdmin,
      password: CREDENTIALS.password,
      administrador: "true",
    });
    TestContext.set("emailAdmin", emailAdmin);
    TestContext.set("adminId", resUser.body._id);
  });

  afterAll(async () => {
    if (TestContext.has("adminId")) {
      await userService.excluir(TestContext.get("adminId"));
    }
    TestContext.clear();
  });

  it("Deve autenticar usuário administrador com sucesso e retornar token Bearer (status 200)", async () => {
    const cenario = "Deve autenticar usuário administrador com sucesso e retornar token Bearer";
    logger.info({ module: "login", message: `Iniciado cenário: ${cenario}` });

    const response = await authService
      .login({
        email: TestContext.get("emailAdmin"),
        password: CREDENTIALS.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty("message", "Login realizado com sucesso");
    expect(response.body).toHaveProperty("authorization");
    expect(response.body.authorization).toMatch(/^Bearer\s+/);

    logger.info({ module: "login", message: `Aprovado cenário: ${cenario}` });
  });

  it("Deve rejeitar autenticação com senha inválida (status 401)", async () => {
    const cenario = "Deve rejeitar autenticação com senha inválida";
    logger.info({ module: "login", message: `Iniciado cenário: ${cenario}` });

    const response = await authService
      .login({
        email: TestContext.get("emailAdmin"),
        password: "senha_incorreta_xyz",
      })
      .expect(401);

    expect(response.body).toHaveProperty("message", "Email e/ou senha inválidos");
    logger.info({ module: "login", message: `Aprovado cenário: ${cenario}` });
  });
});
