class TestContext {
  static #store = new Map();

  static set(key, value) {
    TestContext.#store.set(key, value);
  }

  static get(key) {
    return TestContext.#store.get(key);
  }

  static has(key) {
    return TestContext.#store.has(key);
  }

  static delete(key) {
    return TestContext.#store.delete(key);
  }

  static clear() {
    TestContext.#store.clear();
  }

  static all() {
    return Object.fromEntries(TestContext.#store);
  }
}

module.exports = TestContext;
