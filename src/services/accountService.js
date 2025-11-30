import { ref, set, get, update, push } from 'firebase/database';
import { database } from '../config/firebaseConfig';

// Generar código aleatorio de 6 dígitos
export const generateAccountCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Crear una nueva cuenta compartida
export const createSharedAccount = async (userId, accountCode) => {
  try {
    const accountRef = ref(database, `sharedAccounts/${accountCode}`);
    
    // Verificar si el código ya existe
    const snapshot = await get(accountRef);
    if (snapshot.exists()) {
      return { success: false, error: 'Este código ya está en uso' };
    }

    // Crear la cuenta compartida
    await set(accountRef, {
      code: accountCode,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      members: {
        [userId]: {
          role: 'owner',
          joinedAt: new Date().toISOString()
        }
      }
    });

    // Actualizar el usuario con el código de cuenta
    await update(ref(database, `users/${userId}`), {
      sharedAccountCode: accountCode
    });

    return { success: true, accountCode };
  } catch (error) {
    console.error('Error al crear cuenta compartida:', error);
    return { success: false, error: 'Error al crear la cuenta compartida' };
  }
};

// Unirse a una cuenta compartida existente usando el código
export const joinSharedAccount = async (userId, accountCode) => {
  try {
    if (!accountCode || accountCode.trim() === '') {
      return { success: false, error: 'Por favor ingresa un código válido' };
    }

    const accountRef = ref(database, `sharedAccounts/${accountCode}`);
    
    // Verificar si el código existe
    const snapshot = await get(accountRef);
    if (!snapshot.exists()) {
      return { success: false, error: 'Código de cuenta no encontrado' };
    }

    const accountData = snapshot.val();

    // Verificar si ya es miembro
    if (accountData.members && accountData.members[userId]) {
      return { success: false, error: 'Ya eres miembro de esta cuenta' };
    }

    // Verificar que no haya más de 2 miembros
    const memberCount = accountData.members ? Object.keys(accountData.members).length : 0;
    if (memberCount >= 2) {
      return { success: false, error: 'Esta cuenta ya tiene el máximo de miembros (2)' };
    }

    // Agregar al usuario como miembro
    await update(ref(database, `sharedAccounts/${accountCode}/members/${userId}`), {
      role: 'member',
      joinedAt: new Date().toISOString()
    });

    // Actualizar el usuario con el código de cuenta
    await update(ref(database, `users/${userId}`), {
      sharedAccountCode: accountCode
    });

    return { success: true, accountCode, accountData };
  } catch (error) {
    console.error('Error al unirse a cuenta compartida:', error);
    return { success: false, error: 'Error al unirse a la cuenta compartida' };
  }
};

// Obtener información de la cuenta compartida
export const getSharedAccountInfo = async (accountCode) => {
  try {
    console.log('Obteniendo info de cuenta:', accountCode);
    const accountRef = ref(database, `sharedAccounts/${accountCode}`);
    const snapshot = await get(accountRef);
    
    if (!snapshot.exists()) {
      console.log('Cuenta no encontrada:', accountCode);
      return { success: false, error: 'Cuenta no encontrada' };
    }

    const accountData = snapshot.val();
    console.log('Datos de cuenta:', accountData);
    
    // Obtener información de todos los miembros
    const members = accountData.members || {};
    const memberIds = Object.keys(members);
    const memberDetails = [];

    for (const memberId of memberIds) {
      try {
        const userRef = ref(database, `users/${memberId}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          // Si no tiene rol, inferirlo del género
          let userRole = userData.role;
          if (!userRole && userData.gender) {
            userRole = userData.gender === 'Femenino' ? 'Novia' : 
                      userData.gender === 'Masculino' ? 'Novio' : 'Miembro';
          } else if (!userRole) {
            userRole = 'Miembro';
          }
          
          memberDetails.push({
            uid: memberId,
            name: userData.name || userData.email?.split('@')[0] || 'Usuario',
            email: userData.email,
            gender: userData.gender,
            role: userRole,
            accountRole: members[memberId].role,
            joinedAt: members[memberId].joinedAt
          });
        } else {
          console.log('Usuario no encontrado:', memberId);
          // Agregar usuario con datos mínimos
          memberDetails.push({
            uid: memberId,
            name: 'Usuario',
            email: 'No disponible',
            role: members[memberId].role,
            joinedAt: members[memberId].joinedAt
          });
        }
      } catch (userError) {
        console.error('Error al obtener usuario:', memberId, userError);
        // Continuar con el siguiente usuario
      }
    }

    console.log('Miembros encontrados:', memberDetails.length);
    return {
      success: true,
      account: {
        code: accountCode,
        createdAt: accountData.createdAt,
        members: memberDetails
      }
    };
  } catch (error) {
    console.error('Error al obtener info de cuenta:', error);
    return { success: false, error: 'Error al obtener información de la cuenta' };
  }
};

// Salir de una cuenta compartida
export const leaveSharedAccount = async (userId, accountCode) => {
  try {
    // Eliminar al usuario de los miembros
    await set(ref(database, `sharedAccounts/${accountCode}/members/${userId}`), null);

    // Eliminar el código de cuenta del usuario
    await update(ref(database, `users/${userId}`), {
      sharedAccountCode: null
    });

    // Verificar si quedan miembros
    const accountRef = ref(database, `sharedAccounts/${accountCode}`);
    const snapshot = await get(accountRef);
    
    if (snapshot.exists()) {
      const accountData = snapshot.val();
      const remainingMembers = accountData.members ? Object.keys(accountData.members) : [];
      
      // Si no quedan miembros, eliminar la cuenta
      if (remainingMembers.length === 0) {
        await set(accountRef, null);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error al salir de cuenta:', error);
    return { success: false, error: 'Error al salir de la cuenta compartida' };
  }
};
