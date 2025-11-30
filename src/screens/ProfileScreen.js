import React, { useState, useEffect } from 'react';
import { StatusBar, Alert, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  VStack,
  HStack,
  Text,
  Avatar,
  AvatarImage,
  Pressable,
  Box,
} from '@gluestack-ui/themed';
import { ChevronLeft, User, Bell, Languages, Monitor, Users, Copy } from 'lucide-react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { getUserData } from '../services/authService';
import { getSharedAccountInfo } from '../services/accountService';
import { auth } from '../config/firebaseConfig';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState('Rol');
  const [userAvatar, setUserAvatar] = useState(null);
  const [bgColor, setBgColor] = useState('#ccc');
  const [activeMenu, setActiveMenu] = useState('perfil');
  const [accountCode, setAccountCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userData = await getUserData(currentUser.uid);
        
        if (userData.success) {
          // Establecer nombre del usuario
          const displayName = userData.data.name || currentUser.displayName || 'Usuario';
          setUserName(displayName);
          
          // Establecer rol del usuario
          const role = userData.data.role || 'Miembro';
          setUserRole(role);
          
          // Establecer avatar y color según género/rol
          if (userData.data.gender === 'Femenino' || role === 'Novia') {
            setUserAvatar('👰');
            setBgColor('#FFE5E5');
          } else if (userData.data.gender === 'Masculino' || role === 'Novio') {
            setUserAvatar('🤵');
            setBgColor('#E5F0FF');
          } else {
            setUserAvatar('👤');
            setBgColor('#F0F0F0');
          }
          
          // Obtener código de cuenta compartida
          if (userData.data.sharedAccountCode) {
            const accountInfo = await getSharedAccountInfo(userData.data.sharedAccountCode);
            if (accountInfo.success) {
              setAccountCode(accountInfo.account.code);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (accountCode) {
      try {
        await Share.share({
          message: `Código de cuenta Nuptiae: ${accountCode}\n\nUsa este código para unirte a nuestra cuenta compartida.`
        });
      } catch (error) {
        Alert.alert('Código', accountCode);
      }
    }
  };

  const menuItems = [
    {
      id: 'perfil',
      label: 'Perfil',
      icon: <User size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('perfil');
        // Navigate to ProfileDetail in the root stack
        const avatarUri = typeof userAvatar === 'object' && userAvatar?.uri ? userAvatar.uri : userAvatar;
        navigation.getParent()?.navigate('ProfileDetail', {
          name: userName,
          role: userRole,
          avatar: avatarUri,
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
      id: 'cuenta',
      label: 'Cuenta Compartida',
      icon: <Users size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('cuenta');
        // Navigate to SharedAccount in the root stack
        navigation.getParent()?.navigate('SharedAccount');
      },
    },
    {
      id: 'idioma',
      label: 'Idioma',
      icon: <Languages size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('idioma');
        // Navigate to Idioma in the drawer
        const avatarUri = typeof userAvatar === 'object' && userAvatar?.uri ? userAvatar.uri : userAvatar;
        navigation.navigate('Idioma', {
          name: userName,
          role: userRole,
          avatar: avatarUri,
          username: 'usuario123',
          bgColor,
        });
      },
    },
    {
      id: 'pantalla',
      label: 'Pantalla',
      icon: <Monitor size={24} color="#555" />,
      onPress: () => {
        setActiveMenu('pantalla');
        // Navigate to Pantalla in the drawer
        const avatarUri = typeof userAvatar === 'object' && userAvatar?.uri ? userAvatar.uri : userAvatar;
        navigation.navigate('Pantalla', {
          name: userName,
          role: userRole,
          avatar: avatarUri,
          username: 'usuario123',
          bgColor,
        });
      },
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <VStack flex={1}>
          {/* Header */}
          <HStack px={16} py={16} alignItems="center">
            <Pressable onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#999" />
            </Pressable>
          </HStack>

          {/* Avatar y nombre */}
          <VStack alignItems="center" mb={24}>
            <Avatar size="2xl" mb={16} bg={bgColor}>
              {userAvatar && <AvatarImage source={{ uri: userAvatar }} alt={userName} />}
            </Avatar>
            <Text fontSize={24} fontWeight="600" color="#111">{userName}</Text>
            <Text fontSize={16} color="#666" mt={4}>{userRole}</Text>
          </VStack>

          {/* Código de Cuenta Compartida */}
          {accountCode && !loading && (
            <Box mx={16} mb={24} p={16} borderRadius={16} bg="#fff" borderWidth={1} borderColor="#e0e0e0">
              <HStack alignItems="center" mb={12}>
                <Users size={20} color="#ff6b6b" />
                <Text fontSize={14} fontWeight="600" color="#333" ml={8}>
                  Código de Cuenta Compartida
                </Text>
              </HStack>
              <HStack 
                alignItems="center" 
                justifyContent="space-between"
                p={12} 
                borderRadius={12} 
                bg="#fff5f5"
                borderWidth={2}
                borderColor="#ff6b6b"
                borderStyle="dashed"
              >
                <Text fontSize={28} fontWeight="700" color="#ff6b6b" letterSpacing={4}>
                  {accountCode}
                </Text>
                <TouchableOpacity onPress={handleCopyCode}>
                  <Copy size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </HStack>
              <Text fontSize={12} color="#999" mt={8}>
                Comparte este código con tu pareja para unirse
              </Text>
            </Box>
          )}

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
  );
}
