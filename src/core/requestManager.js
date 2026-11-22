const request = require("supertest");
const { BASE_URL, TIMEOUT } = require("../config/api");
const { logger } = require("./logger");

class RequestManager {
  static #instance = null;

  constructor() {
    if (RequestManager.#instance) {
      throw new Error(
        "Instância já existente. Utilize RequestManager.getInstance() para obter a instância única."
      );
    }
    this.baseUrl = BASE_URL;
    this.timeoutMs = TIMEOUT;
    this.authToken = null;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  static getInstance() {
    if (!RequestManager.#instance) {
      RequestManager.#instance = new RequestManager();
    }
    return RequestManager.#instance;
  }

  static resetInstance() {
    RequestManager.#instance = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  getAuthToken() {
    return this.authToken;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  #applyHeaders(req, method, endpoint) {
    const startTime = Date.now();
    req.timeout(this.timeoutMs);

    for (const [key, value] of Object.entries(this.defaultHeaders)) {
      req.set(key, value);
    }
    if (this.authToken) {
      req.set("Authorization", this.authToken);
    }

    req.on("response", (res) => {
      const duration = Date.now() - startTime;
      const modulo = endpoint.split("/").filter(Boolean)[0] || "api";
      const nivel = res.status >= 500 ? "error" : res.status >= 400 ? "warn" : "info";
      logger.log({
        level: nivel,
        module: modulo,
        message: `${method} ${endpoint} finalizado com status ${res.status} em ${duration}ms`,
      });
    });

    return req;
  }

  get(endpoint) {
    const req = request(this.baseUrl).get(endpoint);
    return this.#applyHeaders(req, "GET", endpoint);
  }

  post(endpoint) {
    const req = request(this.baseUrl).post(endpoint);
    return this.#applyHeaders(req, "POST", endpoint);
  }

  put(endpoint) {
    const req = request(this.baseUrl).put(endpoint);
    return this.#applyHeaders(req, "PUT", endpoint);
  }

  delete(endpoint) {
    const req = request(this.baseUrl).delete(endpoint);
    return this.#applyHeaders(req, "DELETE", endpoint);
  }
}

module.exports = RequestManager;
