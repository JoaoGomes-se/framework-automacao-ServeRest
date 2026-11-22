const AuthService = require("../../src/services/authService");
const userService = require("../../src/services/userService");
const productService = require("../../src/services/productService");
const CartService = require("../../src/services/cartService");
const TestContext = require("../../src/core/context");
const { CREDENTIALS } = require("../../src/config/api");
const { generateUniqueEmail, generateUniqueProductName } = require("../../src/helpers/utils");
const { logger } = require("../../src/core/logger");

describe("Migração Módulo 4 - Carrinhos (/carrinhos)", () => {
  const authService = new AuthService();
  const cartService = new CartService();

  beforeAll(async () => {
    TestContext.clear();

    const adminEmail = generateUniqueEmail();
    await userService.cadastrar({
      nome: "Admin Carrinho QA",
      email: adminEmail,
      password: CREDENTIALS.password,
      administrador: "true",
    });

    const adminLogin = await authService.login({
      email: adminEmail,
      password: CREDENTIALS.password,
    });
    const adminToken = adminLogin.body.authorization;

    const prodRes = await productService.cadastrar(
      {
        nome: generateUniqueProductName(),
        preco: 120,
        descricao: "Item para teste de carrinho",
        quantidade: 10,
      },
      adminToken
    );
    TestContext.set("produtoId", prodRes.body._id);

    const emailComprador = generateUniqueEmail();
    await userService.cadastrar({
      nome: "Comprador QA Enio",
      email: emailComprador,
      password: CREDENTIALS.password,
      administrador: "false",
    });

    const loginUser = await authService.login({
      email: emailComprador,
      password: CREDENTIALS.password,
    });
    TestContext.set("userToken", loginUser.body.authorization);
  });

  afterAll(async () => {
    if (TestContext.has("userToken")) {
      await cartService.cancelarCompra(TestContext.get("userToken"));
    }
    TestContext.clear();
  });

  it("Deve cadastrar um carrinho com produto válido com sucesso (status 201)", async () => {
    const cenario = "Deve cadastrar um carrinho com produto válido com sucesso";
    logger.info({ module: "carrinhos", message: `Iniciado cenário: ${cenario}` });

    const response = await cartService
      .cadastrar(
        {
          produtos: [
            {
              idProduto: TestContext.get("produtoId"),
              quantidade: 1,
            },
          ],
        },
        TestContext.get("userToken")
      )
      .expect(201);

    expect(response.body).toHaveProperty("message", "Cadastro realizado com sucesso");
    expect(response.body).toHaveProperty("_id");
    expect(typeof response.body._id).toBe("string");

    logger.info({ module: "carrinhos", message: `Aprovado cenário: ${cenario}` });
  });

  it("Deve cancelar a compra do carrinho liberando estoque (status 200)", async () => {
    const cenario = "Deve cancelar a compra do carrinho liberando estoque";
    logger.info({ module: "carrinhos", message: `Iniciado cenário: ${cenario}` });

    const response = await cartService.cancelarCompra(TestContext.get("userToken")).expect(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(
      /Registro excluído com sucesso|Não foi encontrado carrinho/
    );

    logger.info({ module: "carrinhos", message: `Aprovado cenário: ${cenario}` });
  });
});
