const request = require("supertest");
const { BASE_URL } = require("../../src/config/api");

describe("PoC 2 - Supertest: Autenticação com Payload no Body (POST /login)", () => {
  it("Deve realizar login com credenciais válidas e retornar status 200 e Bearer token", async () => {
    const payloadLogin = {
      email: "fulano@qa.com",
      password: "teste",
    };

    const response = await request(BASE_URL)
      .post("/login")
      .send(payloadLogin)
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    // Validações da resposta
    expect(response.body).toHaveProperty("message", "Login realizado com sucesso");
    expect(response.body).toHaveProperty("authorization");
    expect(typeof response.body.authorization).toBe("string");
    expect(response.body.authorization.startsWith("Bearer ")).toBe(true);
  });
});
