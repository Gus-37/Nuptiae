import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import {
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarImage,
  Pressable,
  Icon,
} from '@gluestack-ui/themed';
import { ChevronLeft, User, Key, RotateCcw, Languages, Monitor, Home, FileText, CreditCard, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const { name, role, avatar, bgColor } = route.params;

  const menuItems = [
    { id: 'perfil', label: 'Perfil', icon: User, active: true },
    { id: 'contrasena', label: 'Contraseña', icon: Key, active: false },
    { id: 'actividad', label: 'Actividad', icon: RotateCcw, active: false },
    { id: 'idioma', label: 'Idioma', icon: Languages, active: false },
    { id: 'pantalla', label: 'Pantalla', icon: Monitor, active: false },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <VStack flex={1}>
          {/* Header */}
          <HStack px="$4" py="$4" alignItems="center">
            <Pressable onPress={() => navigation.goBack()}>
              <Icon as={ChevronLeft} size="xl" color="$textLight400" />
            </Pressable>
          </HStack>

          {/* Avatar y nombre dinámicos */}
          <VStack alignItems="center" mb="$8">
            <Avatar size="2xl" mb="$4" bg={bgColor}>
              <AvatarImage source={{ uri: avatar }} alt={name} />
            </Avatar>
            <Text fontSize="$xl" fontWeight="$semibold" color="$textLight900">
              {name}
            </Text>
            <Text fontSize="$md" color="$textLight500" mt="$1">
              {role}
            </Text>
          </VStack>

          {/* Menu Items */}
          <VStack flex={1} px="$4" space="xs">
            {menuItems.map((item) => (
              <Pressable key={item.id} onPress={() => console.log(`${item.label} pressed`)}>
                <HStack alignItems="center" space="md" px="$4" py="$4" borderRadius="$full" bg={item.active ? '$orange100' : 'transparent'}>
                  <Icon as={item.icon} size="lg" color={item.active ? '$orange800' : '$textLight700'} />
                  <Text fontSize="$md" fontWeight={item.active ? '$medium' : '$normal'} color={item.active ? '$orange900' : '$textLight700'}>
                    {item.label}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </SafeAreaView>
    </>
  );
}
