const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Suprimir warnings específicos de librerías de terceros
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('SafeAreaView has been deprecated') ||
     message.includes('Please pass alt prop to Image'))
  ) {
    return; // Ignorar estos warnings
  }
  originalWarn(...args);
};

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
