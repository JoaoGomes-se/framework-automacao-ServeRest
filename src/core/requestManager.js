const request = require('supertest');
const { BASE_URL } = require('../config/api');

class RequestManager {
  static #instance = null;

  constructor() {
    if (RequestManager.#instance) {
      throw new Error(
        'Instância já existente. Utilize RequestManager.getInstance() para obter a instância única.'
      );
    }
    this.baseUrl = BASE_URL;
    this.authToken = null;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
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

  #applyHeaders(req) {
    for (const [key, value] of Object.entries(this.defaultHeaders)) {
      req.set(key, value);
    }
    if (this.authToken) {
      req.set('Authorization', this.authToken);
    }
    return req;
  }

  get(endpoint) {
    const req = request(this.baseUrl).get(endpoint);
    return this.#applyHeaders(req);
  }

  post(endpoint) {
    const req = request(this.baseUrl).post(endpoint);
    return this.#applyHeaders(req);
  }

  put(endpoint) {
    const req = request(this.baseUrl).put(endpoint);
    return this.#applyHeaders(req);
  }

  delete(endpoint) {
    const req = request(this.baseUrl).delete(endpoint);
    return this.#applyHeaders(req);
  }
}

module.exports = RequestManager;
