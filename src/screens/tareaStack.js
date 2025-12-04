import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TareasScreen from '../screens/TareasScreen';
import AddTareaScreen from '../screens/AddTareaScreen';

const Stack = createNativeStackNavigator();

export default function TareasStack() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Buscar micrófonos',
      priority: 'Urgente',
      color: '#f08080',
      completed: false,
    },
    {
      id: 2,
      title: 'Conseguir spot fotos',
      priority: 'Puede esperar',
      color: '#ffa500',
      completed: false,
    },
    {
      id: 3,
      title: 'Confirmar juez civil',
      priority: 'Urgente',
      color: '#f08080',
      completed: false,
    },
    {
      id: 4,
      title: 'Contratar proveedores clave',
      priority: 'Importante',
      color: '#ff6b6b',
      completed: false,
    },
    {
      id: 5,
      title: 'Elegir fecha y lugar',
      priority: 'Importante',
      color: '#ff6b6b',
      completed: false,
    },
  ]);

  const handleAddTarea = (newTarea) => {
    setTasks([...tasks, newTarea]);
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TareasScreenMain"
        component={TareasScreen}
        initialParams={{
          tasks: tasks,
          onToggleTask: handleToggleTask,
          setTasks: setTasks,
        }}
        listeners={({ navigation }) => ({
          beforeRemove: (e) => {
            // Sincronizar tareas cuando vuelves
          },
        })}
      />
      <Stack.Screen
        name="AddTarea"
        component={AddTareaScreen}
        initialParams={{
          onAddTarea: handleAddTarea,
        }}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
