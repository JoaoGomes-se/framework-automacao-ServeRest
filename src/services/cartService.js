const RequestManager = require("../core/requestManager");

class CartService {
  constructor() {
    this.requestManager = RequestManager.getInstance();
  }

  cadastrar(payload, token = null) {
    const req = this.requestManager.post("/carrinhos").send(payload);
    if (token) {
      req.set("Authorization", token);
    }
    return req;
  }

  listar(params = {}) {
    const req = this.requestManager.get("/carrinhos");
    if (Object.keys(params).length > 0) {
      req.query(params);
    }
    return req;
  }

  buscarPorId(id) {
    return this.requestManager.get(`/carrinhos/${id}`);
  }

  cancelarCompra(token = null) {
    const req = this.requestManager.delete("/carrinhos/cancelar-compra");
    if (token) {
      req.set("Authorization", token);
    }
    return req;
  }
}

module.exports = CartService;
