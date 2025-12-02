
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { databaseAgendas } from '../config/firebaseAgendas';
import { ref, onValue, update, remove } from 'firebase/database';
import { useUISettings } from '../context/UISettingsContext';

export default function TareasScreen({ navigation, hideHeader = false }) {
  const { colors, fontScale, theme } = useUISettings();
  // estado inicial basado en dimensiones actuales
  const window = Dimensions.get('window');
  const [isLandscape, setIsLandscape] = useState(window.width > window.height);

  // Detectar rotación real del dispositivo
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsLandscape(window.width > window.height);
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  //  Permitir rotación solo aquí + ocultar header y tabs en landscape
  useFocusEffect(
    useCallback(() => {
      const enableOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (err) {
          console.warn('Error desbloqueando orientación:', err);
        }
      };

      enableOrientation();

      // 👇 Ajustar header y tabs dinámicamente
      navigation.setOptions({
        headerShown: !isLandscape, // Oculta header si está en landscape
        tabBarStyle: isLandscape ? { display: 'none' } : {}, // Oculta tabs si landscape
      });

      return () => {
        const lockPortrait = async () => {
          try {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          } catch (err) {
            console.warn('Error bloqueando orientación al salir:', err);
          }
        };

        lockPortrait();

        // Restaurar visibilidad cuando salgamos
        navigation.setOptions({
          headerShown: true,
          tabBarStyle: {},
        });
      };
    }, [isLandscape])
  );

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Buscar micrófonos', priority: 'Urgente', color: '#f08080', completed: false },
    { id: 2, title: 'Conseguir spot fotos', priority: 'Puede esperar', color: '#ffa500', completed: false },
    { id: 3, title: 'Confirmar juez civil', priority: 'Urgente', color: '#f08080', completed: false },
    { id: 4, title: 'Contratar proveedores', priority: 'Importante', color: '#ff6b6b', completed: false },
    { id: 5, title: 'Elegir fecha y lugar', priority: 'Importante', color: '#ff6b6b', completed: false },
  ]);

  // Cargar tareas desde Firebase Realtime Database (agenda/tasks)
  React.useEffect(() => {
    const tasksRef = ref(databaseAgendas, 'agenda/tasks');
    const unsub = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Ensure the React list `id` is the Firebase-generated key so keys are unique
        let items = Object.keys(data).map((key) => ({ ...data[key], id: key }));
        // Deduplicate by id just in case (keep last occurrence)
        const map = new Map();
        items.forEach((it) => {
          map.set(String(it.id), it);
        });
        items = Array.from(map.values());
        setTasks(items);
      } else {
        // mantén el estado local predeterminado si no hay datos
      }
    });

    return () => unsub();
  }, []);

  const toggleTask = (id) => {
    // Use functional update to avoid race conditions and get the new value
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const toggled = updated.find((t) => t.id === id);
      try {
        const taskRef = ref(databaseAgendas, `agenda/tasks/${id}`);
        update(taskRef, { completed: toggled ? toggled.completed : true });
      } catch (err) {
        console.warn('Error actualizando tarea en Firebase:', err);
      }

      return updated;
    });
  };

  const handleAddTarea = (newTarea) => {
    // Avoid adding duplicates if the item (by id) already exists
    if (!newTarea || !newTarea.id) return;
    setTasks(current => {
      const exists = current.find((t) => String(t.id) === String(newTarea.id));
      if (exists) return current;
      return [...current, newTarea];
    });
  };

  const deleteTask = async (id) => {
    try {
      await remove(ref(databaseAgendas, `agenda/tasks/${id}`));
    } catch (err) {
      console.warn('Error eliminando tarea en Firebase:', err);
    }
  };

  const editTask = (task) => {
    // Navigate to AddTarea in edit mode
    const parentNav = navigation.getParent ? navigation.getParent() : null;
    const params = {
      editMode: true,
      task,
      onUpdate: (updated) => {
        // update local optimistically
        setTasks((prev) => prev.map((t) => (String(t.id) === String(updated.id) ? updated : t)));
      }
    };

    if (parentNav && parentNav.navigate) {
      parentNav.navigate('AddTarea', params);
    } else {
      navigation.navigate('AddTarea', params);
    }
  };

  const navigateToAddTarea = () => {
    const parentNav = navigation.getParent ? navigation.getParent() : null;

    if (parentNav && parentNav.navigate) {
      parentNav.navigate('AddTarea', { onAddTarea: handleAddTarea });
    } else {
      navigation.navigate('AddTarea', { onAddTarea: handleAddTarea });
    }
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.taskItem,
        isLandscape && styles.taskItemLandscape,
        item.completed && styles.taskItemCompleted,
      ]}
      onPress={() => toggleTask(item.id)}
    >
      <View style={styles.taskContent}>
        <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
            {item.title}
          </Text>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        {item.completed ? (
          <View style={styles.checkboxChecked}>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </View>
        ) : (
          <View style={styles.checkboxEmpty} />
        )}
      </View>
      {/* Actions: Edit / Delete */}
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => editTask(item)} style={styles.actionButton}>
          <Ionicons name="pencil" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={[styles.actionButton, { marginLeft: 8 }]}> 
          <Ionicons name="trash" size={18} color="#e53935" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, isLandscape && styles.containerLandscape]}>
      {/* Encabezado (solo visible en portrait ahora y si no está anidado) */}
      {!isLandscape && !hideHeader && (
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }] }>
          <Text style={[styles.headerText, { color: colors.text }]}>Tareas</Text>
          <Text style={[styles.taskCount, { color: colors.muted }]}>
            {tasks.filter(t => !t.completed).length} pendientes
          </Text>
        </View>
      )}

      <FlatList
        key={isLandscape ? 'h' : 'v'} // Fuerza re-render cuando cambian columnas
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => {
          // Make extractor defensive in case item.id is missing
          if (item && item.id !== undefined && item.id !== null) return String(item.id);
          if (item && item.createdAt) return String(item.createdAt);
          if (item && item.title) return item.title;
          return Math.random().toString();
        }}
        numColumns={isLandscape ? 2 : 1}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={isLandscape ? styles.columnWrapper : undefined}
      />

      {/* Botón flotante */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }, isLandscape && styles.fabLandscape]} onPress={navigateToAddTarea}>
        <Ionicons name="add" size={32} color={'#fff'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLandscape: {
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  taskCount: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f08080',
  },
  taskItemLandscape: {
    width: '48%',
  },
  taskItemCompleted: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  priorityText: {
    fontSize: 12,
    color: '#999',
  },
  checkboxContainer: {
    marginLeft: 10,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f08080',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabLandscape: {
    bottom: 15,
    right: 15,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 1,
  },
});
