const TestContext = require("../../src/core/context");

describe("TestContext", () => {
  beforeEach(() => {
    TestContext.clear();
  });

  it("Deve salvar e recuperar dados compartilhados no contexto", () => {
    TestContext.set("userId", "user_abc_123");
    TestContext.set("authToken", "Bearer jwt.token.mock");

    expect(TestContext.get("userId")).toBe("user_abc_123");
    expect(TestContext.get("authToken")).toBe("Bearer jwt.token.mock");
  });

  it("Deve verificar a existência de variáveis usando has()", () => {
    TestContext.set("produtoId", "prod_456");

    expect(TestContext.has("produtoId")).toBe(true);
    expect(TestContext.has("carrinhoId")).toBe(false);
  });

  it("Deve remover uma chave específica usando delete()", () => {
    TestContext.set("tempData", "dadoTemporario");
    expect(TestContext.has("tempData")).toBe(true);

    TestContext.delete("tempData");
    expect(TestContext.has("tempData")).toBe(false);
    expect(TestContext.get("tempData")).toBeUndefined();
  });

  it("Deve limpar todas as variáveis com clear()", () => {
    TestContext.set("var1", "valor1");
    TestContext.set("var2", "valor2");

    TestContext.clear();

    expect(TestContext.get("var1")).toBeUndefined();
    expect(TestContext.get("var2")).toBeUndefined();
    expect(Object.keys(TestContext.all())).toHaveLength(0);
  });
});
