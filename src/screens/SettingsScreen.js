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
  Box,
} from '@gluestack-ui/themed';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const users = [
    {
      name: 'Jessica',
      role: 'Novia',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      bgColor: '$pink300',
    },
    {
      name: 'Michael',
      role: 'Novio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bgColor: '$blue300',
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <VStack flex={1}>
          {/* Header */}
          <HStack
            px="$4"
            py="$3"
            alignItems="center"
            borderBottomWidth={1}
            borderBottomColor="$borderLight200"
          >
            <Pressable onPress={() => navigation.goBack()}>
              <Icon as={ChevronLeft} size="xl" color="$textLight800" />
            </Pressable>
            <Text fontSize="$lg" fontWeight="$semibold" ml="$3">
              Configuración de cuentas
            </Text>
          </HStack>

          <VStack flex={1} px="$4" pt="$6">
            <VStack alignItems="center" mb="$6">
              <Text fontSize="$3xl" fontWeight="$bold" color="$textLight900">
                456
              </Text>
              <Text fontSize="$sm" color="$textLight600">
                Código de cuenta dúo
              </Text>
            </VStack>

            {/* Lista de usuarios */}
            {users.map((user) => (
              <Pressable
                key={user.name}
                onPress={() =>
                  navigation.navigate('Profile', {
                    name: user.name,
                    role: user.role,
                    avatar: user.avatar,
                    bgColor: user.bgColor,
                  })
                }
              >
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  py="$4"
                  borderBottomWidth={1}
                  borderBottomColor="$borderLight100"
                >
                  <HStack alignItems="center" space="md">
                    <Avatar size="md" bg={user.bgColor}>
                      <AvatarImage source={{ uri: user.avatar }} alt={user.name} />
                    </Avatar>
                    <VStack>
                      <Text fontSize="$md" fontWeight="$medium" color="$textLight900">
                        {user.name}
                      </Text>
                      <Text fontSize="$sm" color="$textLight500">
                        {user.role}
                      </Text>
                    </VStack>
                  </HStack>
                  <Icon as={ChevronRight} size="lg" color="$textLight400" />
                </HStack>
              </Pressable>
            ))}

            {/* Planner de boda button */}
            <Pressable mt="$6" onPress={() => console.log('Planner de boda pressed')}>
              <Box bg="$pink100" borderRadius="$full" py="$4" alignItems="center">
                <Text fontSize="$md" fontWeight="$medium" color="$pink800">
                  Planner de boda
                </Text>
              </Box>
            </Pressable>
          </VStack>
        </VStack>
      </SafeAreaView>
    </>
  );
}
