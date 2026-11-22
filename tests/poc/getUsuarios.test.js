const request = require("supertest");
const { BASE_URL } = require("../../src/config/api");

describe("PoC 1 - Supertest: Consulta Pública de Usuários (GET /usuarios)", () => {
  it("Deve listar os usuários cadastrados com status 200 OK e estrutura válida", async () => {
    const response = await request(BASE_URL)
      .get("/usuarios")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    // Validações de integridade e tipo
    expect(response.body).toHaveProperty("quantidade");
    expect(typeof response.body.quantidade).toBe("number");
    expect(response.body).toHaveProperty("usuarios");
    expect(Array.isArray(response.body.usuarios)).toBe(true);
    expect(response.body.usuarios.length).toBeGreaterThan(0);

    // Validação da estrutura do primeiro usuário
    const primeiroUsuario = response.body.usuarios[0];
    expect(primeiroUsuario).toHaveProperty("nome");
    expect(primeiroUsuario).toHaveProperty("email");
    expect(primeiroUsuario).toHaveProperty("password");
    expect(primeiroUsuario).toHaveProperty("administrador");
    expect(primeiroUsuario).toHaveProperty("_id");
  });
});
