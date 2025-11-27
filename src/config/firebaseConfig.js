import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDIww3n8wIjqgE2Sgi618gaCsrB6kaUoVI",
  authDomain: "nuptiae-login.firebaseapp.com",
  databaseURL: "https://nuptiae-login-default-rtdb.firebaseio.com",
  projectId: "nuptiae-login",
  storageBucket: "nuptiae-login.firebasestorage.app",
  messagingSenderId: "935395733358",
  appId: "1:935395733358:web:40dd85a98f993045bb1b7f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializar Database
export const database = getDatabase(app);

export default app;
