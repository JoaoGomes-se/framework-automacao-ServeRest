const RequestManager = require('../core/requestManager');

class ProductService {
  constructor() {
    this.requestManager = RequestManager.getInstance();
  }

  cadastrar(payload, token = null) {
    const req = this.requestManager.post('/produtos').send(payload);
    if (token) {
      req.set('Authorization', token);
    }
    return req;
  }

  buscarPorId(id) {
    return this.requestManager.get(`/produtos/${id}`);
  }

  listar(params = {}) {
    const req = this.requestManager.get('/produtos');
    if (Object.keys(params).length > 0) {
      req.query(params);
    }
    return req;
  }

  excluir(id, token = null) {
    const req = this.requestManager.delete(`/produtos/${id}`);
    if (token) {
      req.set('Authorization', token);
    }
    return req;
  }
}

module.exports = new ProductService();
