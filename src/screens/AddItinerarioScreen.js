import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { Box, HStack, VStack, Text, Pressable } from '@gluestack-ui/themed';

const AddItinerarioScreen = ({ navigation, route }) => {
  const [time, setTime] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    const init = route?.params?.initialItem;
    if (init) {
      setTime(init.time || '');
      setTitle(init.title || '');
      setSubtitle(init.subtitle || '');
    }
  }, [route?.params?.initialItem]);

  const onSave = () => {
    const newItem = { time: time || 'Hora', title: title || 'Título', subtitle: subtitle || '' };

    if (route?.params?.onSave && typeof route.params.onSave === 'function') {
      route.params.onSave(newItem);
      // asegurar que volvemos a Invitados mostrando la pestaña Itinerario
      navigation.navigate('Invitados', { showTab: 'itinerario' });
      return;
    }

    // enviar el nuevo item y pedir que muestre la pestaña itinerario
    navigation.navigate('Invitados', { addedItinerario: newItem, showTab: 'itinerario' });
  };

  const onCancel = () => {
    // volver a Invitados y mostrar pestaña Itinerario
    navigation.navigate('Invitados', { showTab: 'itinerario' });
  };

  return (
    <Box flex={1} px="$4" pt="$12" bg="$coolGray50">
      <VStack space="md">
        <Text fontSize="$lg" fontWeight="$bold">Agregar evento</Text>

        <Box>
          <Text fontSize="$sm" mb="$1">Hora</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="2:00 PM"
            style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
          />
        </Box>

        <Box>
          <Text fontSize="$sm" mb="$1">Título</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ceremonia"
            style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
          />
        </Box>

        <Box>
          <Text fontSize="$sm" mb="$1">Subtítulo</Text>
          <TextInput
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="Iglesia"
            style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8 }}
          />
        </Box>

        <HStack space="md" mt="$4">
          <Pressable onPress={onCancel}>
            <Box px="$4" py="$3" bg="$gray200" borderRadius="$md">
              <Text>Cancelar</Text>
            </Box>
          </Pressable>

          <Pressable onPress={onSave}>
            <Box px="$4" py="$3" bg="$red400" borderRadius="$md">
              <Text color="$white">Guardar</Text>
            </Box>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AddItinerarioScreen;