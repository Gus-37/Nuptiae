import React, { useState, useEffect } from 'react';
import { StatusBar, Alert, TouchableOpacity, Share, useWindowDimensions } from 'react-native';
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
import { auth, database } from '../config/firebaseConfig';
import { ref, get } from 'firebase/database';
import { useUISettings } from '../context/UISettingsContext';

export default function ProfileScreen() {
  const { colors, fontScale, theme } = useUISettings();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation();
  const route = useRoute();
  const [userName, setUserName] = useState('Usuario');
  const [userRole, setUserRole] = useState('Rol');
  const [userAvatar, setUserAvatar] = useState(null);
  const [bgColor, setBgColor] = useState('#ccc');
  const [activeMenu, setActiveMenu] = useState('perfil');
  const [accountCode, setAccountCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daysUntilWedding, setDaysUntilWedding] = useState(90);
  const [progressPercentage, setProgressPercentage] = useState(70);

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
              
              // Obtener fecha de boda y progreso del creador de la cuenta
              const creatorId = accountInfo.account.createdBy;
              if (creatorId) {
                // Si el usuario actual ES el creador, usar sus propios datos
                if (creatorId === currentUser.uid) {
                  console.log('Usuario es el creador, usando datos propios');
                  if (userData.data.weddingDate) {
                    const wedding = new Date(userData.data.weddingDate);
                    const today = new Date();
                    const diffTime = wedding - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setDaysUntilWedding(diffDays > 0 ? diffDays : 0);
                    
                    console.log('Días hasta la boda:', diffDays > 0 ? diffDays : 0);
                    
                    if (userData.data.createdAt) {
                      const startDate = new Date(userData.data.createdAt);
                      const totalDays = Math.ceil((wedding - startDate) / (1000 * 60 * 60 * 24));
                      const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
                      const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
                      setProgressPercentage(Math.round(progress));
                    }
                  }
                } else {
                  // Si NO es el creador, obtener datos del creador
                  console.log('Usuario no es creador, obteniendo datos del creador');
                  const creatorDataSnapshot = await get(ref(database, `users/${creatorId}`));
                  if (creatorDataSnapshot.exists()) {
                    const creatorData = creatorDataSnapshot.val();
                    
                    console.log('Datos del creador:', JSON.stringify(creatorData, null, 2));
                    
                    // Usar la fecha de boda del creador
                    if (creatorData.weddingDate) {
                      const wedding = new Date(creatorData.weddingDate);
                      const today = new Date();
                      const diffTime = wedding - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      setDaysUntilWedding(diffDays > 0 ? diffDays : 0);
                      
                      console.log('Días hasta la boda:', diffDays > 0 ? diffDays : 0);
                      
                      // Calcular progreso basado en la fecha de creación del creador
                      if (creatorData.createdAt) {
                        const startDate = new Date(creatorData.createdAt);
                        const totalDays = Math.ceil((wedding - startDate) / (1000 * 60 * 60 * 24));
                        const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
                        const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
                        setProgressPercentage(Math.round(progress));
                      }
                    }
                  }
                }
              }
            }
          } else {
            // Si no hay cuenta compartida, usar datos propios
            if (userData.data.weddingDate) {
              const wedding = new Date(userData.data.weddingDate);
              const today = new Date();
              const diffTime = wedding - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              setDaysUntilWedding(diffDays > 0 ? diffDays : 0);
              
              if (userData.data.createdAt) {
                const startDate = new Date(userData.data.createdAt);
                const totalDays = Math.ceil((wedding - startDate) / (1000 * 60 * 60 * 24));
                const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
                const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
                setProgressPercentage(Math.round(progress));
              }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <VStack flex={1}>
          {/* Header */}
          <HStack px={16} py={16} alignItems="center">
            <Pressable onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color={colors.muted} />
            </Pressable>
          </HStack>

          {/* Avatar y nombre */}
          <VStack alignItems="center" mb={24}>
            <Avatar size="2xl" mb={16} bg={bgColor}>
              {userAvatar && <AvatarImage source={{ uri: userAvatar }} alt={userName} />}
            </Avatar>
            <Text fontSize={24} fontWeight="600" color={colors.text}>{userName}</Text>
            <Text fontSize={16} color={colors.muted} mt={4}>{userRole}</Text>
            
            {/* Días para la boda */}
            <Box mt={16} alignItems="center">
              <Text fontSize={14} color={colors.muted} mb={4}>Días para tu boda</Text>
              <Text fontSize={32} fontWeight="700" color={colors.accent}>{daysUntilWedding}</Text>
            </Box>
            
            {/* Progress Bar */}
            <Box width="80%" mt={16}>
              <HStack justifyContent="space-between" mb={8}>
                <Text fontSize={12} color={colors.muted}>Progreso de planificación</Text>
                <Text fontSize={12} fontWeight="600" color={colors.text}>{progressPercentage}%</Text>
              </HStack>
              <Box 
                width="100%" 
                height={8} 
                borderRadius={4} 
                bg={theme === 'light' ? '#f0f0f0' : '#2A2A2A'}
              >
                <Box 
                  width={`${progressPercentage}%`} 
                  height="100%" 
                  borderRadius={4} 
                  bg={colors.accent}
                />
              </Box>
            </Box>
          </VStack>

          {/* Código de Cuenta Compartida */}
          {accountCode && !loading && (
            <Box mx={16} mb={24} p={16} borderRadius={16} bg={colors.card} borderWidth={1} borderColor={colors.border}>
              <HStack alignItems="center" mb={12}>
                <Users size={20} color={colors.accent} />
                <Text fontSize={14} fontWeight="600" color={colors.text} ml={8}>
                  Código de Cuenta Compartida
                </Text>
              </HStack>
              <HStack 
                alignItems="center" 
                justifyContent="space-between"
                p={12} 
                borderRadius={12} 
                bg={theme === 'light' ? '#fff5f5' : colors.bg}
                borderWidth={2}
                borderColor={colors.accent}
                borderStyle="dashed"
              >
                <Text fontSize={28} fontWeight="700" color={colors.accent} letterSpacing={4}>
                  {accountCode}
                </Text>
                <TouchableOpacity onPress={handleCopyCode}>
                  <Copy size={20} color={colors.accent} />
                </TouchableOpacity>
              </HStack>
              <Text fontSize={12} color={colors.muted} mt={8}>
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
                  style={{ backgroundColor: activeMenu === item.id ? (theme === 'light' ? '#FFE6CC' : colors.card) : 'transparent' }}
                >
                  {item.icon}
                  <Text
                    fontSize={16}
                    fontWeight={activeMenu === item.id ? '500' : '400'}
                    style={{ color: activeMenu === item.id ? colors.accent : colors.text }}
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
