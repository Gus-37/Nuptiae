import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase para autenticación y cuentas de usuarios
const firebaseConfig = {
  apiKey: "AIzaSyDIww3n8wIjqgE2Sgi618gaCsrB6kaUoVI",
  authDomain: "nuptiae-login.firebaseapp.com",
  databaseURL: "https://nuptiae-login-default-rtdb.firebaseio.com",
  projectId: "nuptiae-login",
  storageBucket: "nuptiae-login.firebasestorage.app",
  messagingSenderId: "935395733358",
  appId: "1:935395733358:web:40dd85a98f993045bb1b7f"
};

// Configuración de Firebase para productos y proveedores
const firebaseProvidersConfig = {
  apiKey: "AIzaSyB0a9WcTYxhbBMNOVWGgd9UyJnjul9RbCM",
  authDomain: "nuptiae-proveedores.firebaseapp.com",
  databaseURL: "https://nuptiae-proveedores-default-rtdb.firebaseio.com",
  projectId: "nuptiae-proveedores",
  storageBucket: "nuptiae-proveedores.firebasestorage.app",
  messagingSenderId: "1094362698036",
  appId: "1:1094362698036:web:b03c70c0384fe688be9561"
};

// Inicializar Firebase para usuarios
const app = initializeApp(firebaseConfig);

// Inicializar Firebase para proveedores
const providersApp = initializeApp(firebaseProvidersConfig, 'providers');

// Inicializar Auth con persistencia en React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Base de datos de usuarios y cuentas
export const database = getDatabase(app);

// Base de datos de productos y proveedores
export const providersDatabase = getDatabase(providersApp);

export default app;
export { providersApp };
