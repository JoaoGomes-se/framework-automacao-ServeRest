const RequestManager = require('../core/requestManager');

class UserService {
  constructor() {
    this.requestManager = RequestManager.getInstance();
  }

  cadastrar(payload) {
    return this.requestManager.post('/usuarios').send(payload);
  }

  buscarPorId(id) {
    return this.requestManager.get(`/usuarios/${id}`);
  }

  listar(params = {}) {
    const req = this.requestManager.get('/usuarios');
    if (Object.keys(params).length > 0) {
      req.query(params);
    }
    return req;
  }

  excluir(id) {
    return this.requestManager.delete(`/usuarios/${id}`);
  }
}

module.exports = new UserService();
