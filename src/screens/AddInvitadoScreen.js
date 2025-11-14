import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { Box, HStack, VStack, Text, Pressable } from '@gluestack-ui/themed';
import { ChevronLeft } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

const AddInvitadoScreen = ({ navigation, route }) => {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const [tareas, setTareas] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const tareasOpciones = [
    'Elegir menú',
    'Elegir música',
    'Elegir decoración',
    'Ayudar a recibir invitados',
    'Apoyar con gastos',
    'Apoyar con logística',
    'Conducir el evento',
  ];

  useEffect(() => {
    const init = route?.params?.initialItem;
    if (init) {
      setNombre(init.nombre || '');
      setRol(init.rol || '');
      setTareas(init.tareas || []);
      setIsEditing(true);
    } else {
      setNombre('');
      setRol('');
      setTareas([]);
      setIsEditing(false);
    }
  }, [route?.params?.initialItem]);

  const onSave = () => {
    const newInvitado = {
      nombre: nombre || 'Nombre',
      rol: rol || '',
      tareas: tareas,
    };

    // Si viene de editar (con callback onSave)
    if (route?.params?.onSave && typeof route.params.onSave === 'function') {
      route.params.onSave(newInvitado);
      navigation.goBack();
      return;
    }

    // Si viene de crear (sin callback), vuelve atrás directamente
    navigation.goBack();
  };

  const onCancel = () => {
    if (route?.params?.onSave && typeof route.params.onSave === 'function') {
      navigation.goBack();
      return;
    }
    navigation.navigate('Invitados', { showTab: 'roles' });
  };

  const toggleTarea = (tarea) => {
    if (tareas.includes(tarea)) {
      setTareas(tareas.filter((t) => t !== tarea));
    } else {
      setTareas([...tareas, tarea]);
    }
  };

  return (
    <Box flex={1} bg="$coolGray50">
      {/* Header */}
      <Box bg="$white" pt="$8" pb="$4" px="$4">
        <HStack alignItems="center" justifyContent="space-between" mb="$4">
          <Pressable onPress={onCancel}>
            <ChevronLeft size={28} color="#000" />
          </Pressable>
          <Text fontSize="$lg" fontWeight="$bold" color="$black">
            {isEditing ? 'Editar invitado' : 'Crear invitado'}
          </Text>
          <Box width="$8" />
        </HStack>
      </Box>

      {/* Contenido */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Card de invitado */}
        <Box
          bg="$red400"
          borderRadius="$xl"
          p="$6"
          mb="$6"
        >
          <Text fontSize="$2xl" fontWeight="$bold" color="$white" mb="$2">
            {nombre || 'Nombre del invitado'}
          </Text>
          <HStack alignItems="center" space="sm">
            <Box width="$3" height="$3" bg="$white" borderRadius="$full" />
            <Text fontSize="$md" color="$white">
              {rol || 'Rol del invitado'}
            </Text>
          </HStack>
        </Box>

        {/* Inputs de Nombre y Rol */}
        <VStack space="md" mb="$6">
          <Box>
            <Text fontSize="$sm" fontWeight="$semibold" mb="$2" color="$black">
              Nombre
            </Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre del invitado"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: '#fff',
                fontSize: 16,
              }}
            />
          </Box>

          <Box>
            <Text fontSize="$sm" fontWeight="$semibold" mb="$2" color="$black">
              Rol
            </Text>
            <TextInput
              value={rol}
              onChangeText={setRol}
              placeholder="Rol del invitado"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: '#fff',
                fontSize: 16,
              }}
            />
          </Box>
        </VStack>

        {/* Tareas */}
        <VStack space="md">
          <Text fontSize="$lg" fontWeight="$bold" color="$black">
            Tareas
          </Text>

          {tareasOpciones.map((tarea, index) => (
            <Pressable
              key={index}
              onPress={() => toggleTarea(tarea)}
            >
              <HStack
                alignItems="center"
                space="md"
                bg={tareas.includes(tarea) ? '$red400' : '$white'}
                p="$3"
                borderRadius="$lg"
                borderWidth={1}
                borderColor={tareas.includes(tarea) ? '$red400' : '$coolGray200'}
              >
                <Box
                  width="$5"
                  height="$5"
                  borderRadius="$md"
                  bg={tareas.includes(tarea) ? '$red600' : '$red400'}
                  justifyContent="center"
                  alignItems="center"
                >
                  {tareas.includes(tarea) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </Box>
                <Text
                  fontSize="$md"
                  color={tareas.includes(tarea) ? '$white' : '$black'}
                  flex={1}
                >
                  {tarea}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>

        {/* Botones de acción */}
        <HStack space="md" mt="$8" mb="$4">
          <Pressable onPress={onCancel} flex={1}>
            <Box
              px="$4"
              py="$4"
              bg="$coolGray200"
              borderRadius="$lg"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontWeight="$semibold" color="$black">
                Cancelar
              </Text>
            </Box>
          </Pressable>

          <Pressable onPress={onSave} flex={1}>
            <Box
              px="$4"
              py="$4"
              bg="$red400"
              borderRadius="$lg"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontWeight="$semibold" color="$white">
                {isEditing ? 'Actualizar' : 'Crear'}
              </Text>
            </Box>
          </Pressable>
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default AddInvitadoScreen;