import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { VStack, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function LanguageScreen() {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('es'); // Español por defecto

  const languages = [
    { id: 'es', label: 'Español' },
    { id: 'en', label: 'Inglés' },
    { id: 'fr', label: 'Francés' },
    { id: 'de', label: 'Alemán' },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <VStack flex={1}>
          {/* Header */}
          <HStack px={16} py={16} alignItems="center">
            <Pressable onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#999" />
            </Pressable>
            <Text fontSize={20} fontWeight="600" ml={16}>Idioma</Text>
          </HStack>

          {/* Opciones de idioma */}
          <VStack flex={1} px={16} space={12} mt={16}>
            {languages.map((lang) => {
              const isActive = selectedLanguage === lang.id;
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => setSelectedLanguage(lang.id)}
                >
                  <HStack
                    alignItems="center"
                    justifyContent="center"
                    px={16}
                    py={20}
                    borderRadius={16}
                    style={{
                      backgroundColor: isActive ? '#FFE6CC' : '#f5f5f5',
                    }}
                  >
                    <Text
                      fontSize={18}
                      fontWeight={isActive ? '600' : '400'}
                      style={{ color: isActive ? '#e57373' : '#555' }}
                    >
                      {lang.label}
                    </Text>
                  </HStack>
                </Pressable>
              );
            })}
          </VStack>
        </VStack>
      </SafeAreaView>
    </>
  );
}
