const RequestManager = require("../../src/core/requestManager");

describe("RequestManager - Singleton", () => {
  beforeEach(() => {
    RequestManager.resetInstance();
  });

  afterEach(() => {
    RequestManager.resetInstance();
  });

  it("Deve garantir que duas chamadas a getInstance() devolvem exatamente a mesma instância", () => {
    const instanceA = RequestManager.getInstance();
    const instanceB = RequestManager.getInstance();

    expect(instanceA).toBe(instanceB);
  });

  it("Deve lançar erro ao tentar instanciar diretamente via operador new", () => {
    RequestManager.getInstance();

    expect(() => {
      new RequestManager();
    }).toThrow(
      "Instância já existente. Utilize RequestManager.getInstance() para obter a instância única."
    );
  });

  it("Deve reter e compartilhar o token de autorização na instância única", () => {
    const instance1 = RequestManager.getInstance();
    instance1.setAuthToken("Bearer token-de-teste-123");

    const instance2 = RequestManager.getInstance();
    expect(instance2.getAuthToken()).toBe("Bearer token-de-teste-123");

    instance2.clearAuthToken();
    expect(instance1.getAuthToken()).toBeNull();
  });

  it("Deve retornar uma requisição Supertest configurada com a BASE_URL", () => {
    const manager = RequestManager.getInstance();
    const getRequest = manager.get("/usuarios");

    expect(getRequest).toBeDefined();
    expect(typeof getRequest.set).toBe("function");
  });
});
