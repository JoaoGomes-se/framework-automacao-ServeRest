/**
 * Funções utilitárias para geração de massa de dados única
 * Evita colisões no banco público da ServeRest
 */

function generateUniqueEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `qa_kaio_${timestamp}_${random}@qatest.com`;
}

function generateUniqueProductName() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `Produto Teste QA ${timestamp}_${random}`;
}

module.exports = {
  generateUniqueEmail,
  generateUniqueProductName,
};
