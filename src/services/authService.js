const RequestManager = require("../core/requestManager");

class AuthService {
  constructor() {
    this.requestManager = RequestManager.getInstance();
  }

  login(credenciais) {
    return this.requestManager.post("/login").send(credenciais);
  }
}

module.exports = AuthService;
