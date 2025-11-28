import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuración específica para las vistas de Agenda
const firebaseConfigAgendas = {
  apiKey: "AIzaSyCSGjR61pM6U8dFA2f2vKRDmusUSwSbkdk",
  authDomain: "nuptiae-e888f.firebaseapp.com",
  databaseURL: "https://nuptiae-e888f-default-rtdb.firebaseio.com",
  projectId: "nuptiae-e888f",
  storageBucket: "nuptiae-e888f.firebasestorage.app",
  messagingSenderId: "977654008976",
  appId: "1:977654008976:web:ae88eddd303c1d90455c15"
};

let appAgendas;
try {
  appAgendas = getApp('agendas');
} catch (e) {
  // Si no existe, inicializar con nombre
  if (!getApps().length) {
    appAgendas = initializeApp(firebaseConfigAgendas, 'agendas');
  } else {
    appAgendas = initializeApp(firebaseConfigAgendas, 'agendas');
  }
}

export const databaseAgendas = getDatabase(appAgendas);

export default appAgendas;
