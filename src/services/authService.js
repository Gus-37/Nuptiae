import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from '../config/firebaseConfig';
import { generateAccountCode, createSharedAccount, joinSharedAccount } from './accountService';

// Registrar nuevo usuario
export const registerUser = async (email, password, userData) => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con nombre
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }

    // Guardar datos adicionales en Realtime Database
    await set(ref(database, `users/${user.uid}`), {
      uid: user.uid,
      email: user.email,
      name: userData.name || '',
      role: userData.role || 'Usuario',
      createdAt: new Date().toISOString(),
      ...userData
    });

    // Manejar cuenta compartida
    if (userData.accountCode && userData.accountCode.trim() !== '') {
      // Si proporcionó un código, unirse a esa cuenta
      const joinResult = await joinSharedAccount(user.uid, userData.accountCode.trim());
      if (!joinResult.success) {
        console.warn('Error al unirse a cuenta compartida:', joinResult.error);
        // No falla el registro, solo advierte
      }
    } else {
      // Si no proporcionó código, crear uno nuevo
      const newCode = generateAccountCode();
      await createSharedAccount(user.uid, newCode);
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error en registro:', error);
    
    let errorMessage = 'Error al crear la cuenta';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Por favor ingresa un correo electrónico válido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        errorMessage = 'Error al crear la cuenta. Por favor intenta nuevamente';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener datos adicionales del usuario
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    // Si el usuario no tiene nombre en la base de datos pero sí en displayName, actualizar
    if (user.displayName && (!userData || !userData.name || userData.name === user.email?.split('@')[0])) {
      await update(userRef, {
        name: user.displayName
      });
      if (userData) {
        userData.name = user.displayName;
      }
    }

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userData
      }
    };
  } catch (error) {
    console.error('Error en login:', error);
    let errorMessage = 'Error al iniciar sesión';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Correo electrónico o contraseña incorrectos';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Correo electrónico o contraseña incorrectos';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Correo electrónico o contraseña incorrectos';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Por favor ingresa un correo electrónico válido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Por favor intenta más tarde';
        break;
      default:
        errorMessage = 'Error al iniciar sesión. Por favor intenta nuevamente';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { success: false, error: error.message };
  }
};

// Recuperar contraseña
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: 'Correo de recuperación enviado' };
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    return { success: false, error: error.message };
  }
};

// Obtener datos del usuario
export const getUserData = async (uid) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, error: 'Usuario no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar datos del usuario
export const updateUserData = async (uid, updates) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    await update(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar datos:', error);
    return { success: false, error: error.message };
  }
};
