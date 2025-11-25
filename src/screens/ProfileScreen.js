import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import {
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarImage,
  Pressable,
} from '@gluestack-ui/themed';
import { ChevronLeft, User, Bell, Languages, Monitor } from 'lucide-react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name = 'Usuario', role = 'Rol', avatar, bgColor = '#ccc' } = route.params || {};
  const [userAvatar, setUserAvatar] = useState(avatar);
  const [activeMenu, setActiveMenu] = useState('perfil');

  const menuItems = [
    {
      id: 'perfil',
      label: 'Perfil',
      icon: <User size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('perfil');
        // Navigate to ProfileDetail in the root stack
        navigation.getParent()?.navigate('ProfileDetail', {
          name,
          role,
          avatar: userAvatar,
          username: 'usuario123',
          bgColor,
        });
      },
    },
    {
      id: 'notificaciones',
      label: 'Notificaciones',
      icon: <Bell size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('notificaciones');
        // Navigate to Notifications in the root stack
        navigation.getParent()?.navigate('Notifications');
      },
    },
    {
      id: 'idioma',
      label: 'Idioma',
      icon: <Languages size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('idioma');
        // Navigate to Language in the root stack
        navigation.getParent()?.navigate('Language');
      },
    },
    {
      id: 'pantalla',
      label: 'Pantalla',
      icon: <Monitor size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('pantalla');
        // Navigate to DisplayScreen in the root stack
        navigation.getParent()?.navigate('DisplayScreen');
      },
    },
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
          </HStack>

          {/* Avatar y nombre */}
          <VStack alignItems="center" mb={32}>
            <Avatar size="2xl" mb={16} bg={bgColor}>
              <AvatarImage source={{ uri: userAvatar }} alt={name} />
            </Avatar>
            <Text fontSize={24} fontWeight="600" color="#111">{name}</Text>
            <Text fontSize={16} color="#666" mt={4}>{role}</Text>
          </VStack>

          {/* Menu Items */}
          <VStack flex={1} px={16} space={8}>
            {menuItems.map((item) => (
              <Pressable key={item.id} onPress={item.onPress}>
                <HStack
                  alignItems="center"
                  space={16}
                  px={16}
                  py={16}
                  borderRadius={999}
                  style={{ backgroundColor: activeMenu === item.id ? '#FFE6CC' : 'transparent' }}
                >
                  {item.icon}
                  <Text
                    fontSize={16}
                    fontWeight={activeMenu === item.id ? '500' : '400'}
                    style={{ color: activeMenu === item.id ? '#e57373' : '#555' }}
                  >
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
