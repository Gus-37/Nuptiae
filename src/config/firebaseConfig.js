import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase principal
const firebaseConfig = {
  apiKey: "AIzaSyDIww3n8wIjqgE2Sgi618gaCsrB6kaUoVI",
  authDomain: "nuptiae-login.firebaseapp.com",
  databaseURL: "https://nuptiae-login-default-rtdb.firebaseio.com",
  projectId: "nuptiae-login",
  storageBucket: "nuptiae-login.firebasestorage.app",
  messagingSenderId: "935395733358",
  appId: "1:935395733358:web:40dd85a98f993045bb1b7f"
};

// Nueva configuración para invitados
const invitadosConfig = {
  apiKey: "AIzaSyB_Dztg4WWyvXctUm78tUQwRlQ6ETBuAMA",
  authDomain: "nuptiae-invitados.firebaseapp.com",
  projectId: "nuptiae-invitados",
  storageBucket: "nuptiae-invitados.firebasestorage.app",
  messagingSenderId: "447604988966",
  appId: "1:447604988966:web:4aae3b2db66b7b9ebd1ae7"
};

// Inicializar Firebase principal
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializar Realtime Database
export const database = getDatabase(app);

// Inicializar Realtime Database para invitados
export const invitadosApp = initializeApp(invitadosConfig, "invitados");
export const invitadosDatabase = getDatabase(invitadosApp);

export default app;