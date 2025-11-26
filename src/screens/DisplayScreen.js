import React, { useState } from 'react';
import { StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function DisplayScreen() {
  const navigation = useNavigation();

  const [settings, setSettings] = useState({
    theme: 'light',         // light | dark | auto
    textSize: 'normal',     // normal | large | extra
    highContrast: false,    // alto contraste
    animations: true,       // animaciones habilitadas
    primaryColor: '#FF5733' // color principal de botones, calendario, etc.
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const changeSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Opciones de tamaño de texto
  const textSizes = [
    { id: 'normal', label: 'Normal', fontSize: 16 },
    { id: 'large', label: 'Grande', fontSize: 20 },
    { id: 'extra', label: 'Extra Grande', fontSize: 24 },
  ];

  // Paleta de colores por tema (varios colores por tema)
  const colorThemes = [
    { id: 'minimalista', label: 'Minimalista', colors: ['#607D8B', '#CFD8DC', '#B0BEC5'] },
    { id: 'vibrante', label: 'Vibrante', colors: ['#FF5722', '#FFC107', '#FFEB3B'] },
    { id: 'pastel', label: 'Pastel', colors: ['#FFB74D', '#81C784', '#64B5F6'] },
    { id: 'oscuro', label: 'Oscuro', colors: ['#455A64', '#37474F', '#263238'] },
    { id: 'fresco', label: 'Fresco', colors: ['#4CAF50', '#8BC34A', '#CDDC39'] },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
          <VStack space={24}>

            {/* Header */}
            <HStack py={16} alignItems="center">
              <Pressable onPress={() => navigation.goBack()}>
                <ChevronLeft size={24} color="#999" />
              </Pressable>
              <Text fontSize={20} fontWeight="600" ml={16}>Pantalla</Text>
            </HStack>

            {/* Sección: Tema */}
            <VStack space={12}>
              <Text fontSize={18} fontWeight="600">Tema</Text>
              <HStack space={12}>
                {['light', 'dark', 'auto'].map((theme) => {
                  const isActive = settings.theme === theme;
                  return (
                    <Pressable key={theme} flex={1} onPress={() => changeSetting('theme', theme)}>
                      <VStack
                        alignItems="center"
                        justifyContent="center"
                        px={16}
                        py={20}
                        borderRadius={16}
                        style={{ backgroundColor: isActive ? '#FFE6CC' : '#f5f5f5' }}
                      >
                        <Text
                          fontSize={16}
                          fontWeight={isActive ? '600' : '400'}
                          style={{ color: isActive ? '#e57373' : '#555' }}
                        >
                          {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Automático'}
                        </Text>
                      </VStack>
                    </Pressable>
                  );
                })}
              </HStack>
            </VStack>

            {/* Sección: Tamaño de texto */}
            <VStack space={12}>
              <Text fontSize={18} fontWeight="600">Tamaño de texto</Text>
              <HStack space={12}>
                {textSizes.map((size) => {
                  const isActive = settings.textSize === size.id;
                  return (
                    <Pressable key={size.id} flex={1} onPress={() => changeSetting('textSize', size.id)}>
                      <VStack
                        alignItems="center"
                        justifyContent="center"
                        px={16}
                        py={20}
                        borderRadius={16}
                        style={{ backgroundColor: isActive ? '#FFE6CC' : '#f5f5f5' }}
                      >
                        <Text
                          fontSize={size.fontSize}
                          fontWeight={isActive ? '600' : '400'}
                          style={{ color: isActive ? '#e57373' : '#555' }}
                        >
                          {size.label}
                        </Text>
                      </VStack>
                    </Pressable>
                  );
                })}
              </HStack>
            </VStack>

            {/* Sección: Accesibilidad */}
            <VStack space={12}>
              <Text fontSize={18} fontWeight="600">Accesibilidad</Text>
              <VStack space={12}>
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  px={16}
                  py={16}
                  borderRadius={16}
                  style={{ backgroundColor: settings.highContrast ? '#FFE6CC' : '#f5f5f5' }}
                >
                  <Text fontSize={16} fontWeight={settings.highContrast ? '600' : '400'}>Alto contraste</Text>
                  <Pressable onPress={() => toggleSetting('highContrast')}>
                    <Text style={{ color: settings.highContrast ? '#e57373' : '#555' }}>{settings.highContrast ? 'Activado' : 'Desactivado'}</Text>
                  </Pressable>
                </HStack>

                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  px={16}
                  py={16}
                  borderRadius={16}
                  style={{ backgroundColor: settings.animations ? '#FFE6CC' : '#f5f5f5' }}
                >
                  <Text fontSize={16} fontWeight={settings.animations ? '600' : '400'}>Animaciones</Text>
                  <Pressable onPress={() => toggleSetting('animations')}>
                    <Text style={{ color: settings.animations ? '#e57373' : '#555' }}>{settings.animations ? 'Activado' : 'Desactivado'}</Text>
                  </Pressable>
                </HStack>
              </VStack>
            </VStack>

            {/* Sección: Paleta de colores por tema */}
            <VStack space={12}>
              <Text fontSize={18} fontWeight="600">Paleta de colores</Text>
              <VStack space={12}>
                {colorThemes.map((theme) => {
                  const isActive = settings.primaryColor === theme.colors[0];
                  return (
                    <Pressable key={theme.id} onPress={() => changeSetting('primaryColor', theme.colors[0])}>
                      <VStack
                        px={16}
                        py={16}
                        borderRadius={16}
                        style={{
                          backgroundColor: '#f5f5f5',
                          borderWidth: isActive ? 3 : 0,
                          borderColor: isActive ? '#e57373' : 'transparent',
                        }}
                      >
                        <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 8 }}>{theme.label}</Text>
                        <HStack space={8}>
                          {theme.colors.map((color, idx) => (
                            <VStack
                              key={idx}
                              flex={1}
                              py={20}
                              borderRadius={12}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </HStack>
                      </VStack>
                    </Pressable>
                  );
                })}
              </VStack>
            </VStack>

          </VStack>
        </ScrollView>
      </SafeAreaView>
  );
}
