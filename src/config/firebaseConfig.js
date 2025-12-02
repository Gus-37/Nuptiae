import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
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

// Configuración para invitados
const invitadosConfig = {
  apiKey: "AIzaSyB_Dztg4WWyvXctUm78tUQwRlQ6ETBuAMA",
  authDomain: "nuptiae-invitados.firebaseapp.com",
  projectId: "nuptiae-invitados",
  storageBucket: "nuptiae-invitados.firebasestorage.app",
  messagingSenderId: "447604988966",
  appId: "1:447604988966:web:4aae3b2db66b7b9ebd1ae7"
};

// Configuración para agendas
const firebaseConfigAgendas = {
  apiKey: "AIzaSyCSGjR61pM6U8dFA2f2vKRDmusUSwSbkdk",
  authDomain: "nuptiae-e888f.firebaseapp.com",
  databaseURL: "https://nuptiae-e888f-default-rtdb.firebaseio.com",
  projectId: "nuptiae-e888f",
  storageBucket: "nuptiae-e888f.firebasestorage.app",
  messagingSenderId: "977654008976",
  appId: "1:977654008976:web:ae88eddd303c1d90455c15"
};

// Inicializar Firebase para usuarios
const app = initializeApp(firebaseConfig);

// Inicializar Firebase para proveedores
const providersApp = initializeApp(firebaseProvidersConfig, 'providers');

// Inicializar Firebase para invitados
const invitadosApp = initializeApp(invitadosConfig, 'invitados');

// Inicializar Firebase para agendas
const appAgendas = initializeApp(firebaseConfigAgendas, 'agendas');

// Inicializar Auth con persistencia en React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Base de datos de usuarios y cuentas
export const database = getDatabase(app);

// Base de datos de productos y proveedores
export const providersDatabase = getDatabase(providersApp);

// Base de datos para invitados
export const invitadosDatabase = getDatabase(invitadosApp);

// Base de datos para agendas
export const databaseAgendas = getDatabase(appAgendas);

export default app;
export { providersApp, invitadosApp, appAgendas };
