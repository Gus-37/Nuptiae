// Suprimir warnings específicos en Metro bundler
const originalWarn = console.warn;

console.warn = (...args) => {
  const message = args[0];
  
  // Filtrar warnings conocidos de librerías de terceros
  if (
    typeof message === 'string' &&
    (message.includes('SafeAreaView has been deprecated') ||
     message.includes('Please pass alt prop to Image'))
  ) {
    return; // Ignorar estos warnings
  }
  
  // Mostrar otros warnings
  originalWarn(...args);
};

module.exports = {};
