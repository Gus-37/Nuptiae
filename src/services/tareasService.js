import { database, auth } from '../config/firebaseConfig';
import { ref, push, set, get, update, remove } from 'firebase/database';

// Obtener todas las tareas del usuario actual
export const getTareas = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false, data: [] };

    const tareasRef = ref(database, `tareas/${user.uid}`);
    const snapshot = await get(tareasRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const tareasArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      return { success: true, data: tareasArray };
    }
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error getTareas:', error);
    return { success: false, data: [] };
  }
};

// Crear nueva tarea
export const createTarea = async (tareaData) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false };

    const tareasRef = ref(database, `tareas/${user.uid}`);
    const newTareaRef = push(tareasRef);
    
    await set(newTareaRef, {
      ...tareaData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, id: newTareaRef.key };
  } catch (error) {
    console.error('Error createTarea:', error);
    return { success: false };
  }
};

// Actualizar tarea existente
export const updateTarea = async (tareaId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false };

    const tareaRef = ref(database, `tareas/${user.uid}/${tareaId}`);
    await update(tareaRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updateTarea:', error);
    return { success: false };
  }
};

// Eliminar tarea
export const deleteTarea = async (tareaId) => {
  try {
    const user = auth.currentUser;
    if (!user) return { success: false };

    const tareaRef = ref(database, `tareas/${user.uid}/${tareaId}`);
    await remove(tareaRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleteTarea:', error);
    return { success: false };
  }
};

// Toggle estado completado
export const toggleTareaCompleted = async (tareaId, currentStatus) => {
  return updateTarea(tareaId, { completed: !currentStatus });
};