import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { VStack, HStack, Text, Pressable, Switch } from '@gluestack-ui/themed';
import { ChevronLeft, Key } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const toggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const notificationOptions = [
    { id: 'email', label: 'Correo' },
    { id: 'push', label: 'Push' },
    { id: 'sms', label: 'SMS' },
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
            <Text fontSize={20} fontWeight="600" ml={16}>Notificaciones</Text>
          </HStack>

          {/* Notification Options */}
          <VStack flex={1} px={16} space={8}>
            {notificationOptions.map((option) => (
              <HStack
                key={option.id}
                alignItems="center"
                justifyContent="space-between"
                px={16}
                py={16}
                borderRadius={12}
                style={{ backgroundColor: '#f5f5f5' }}
              >
                <Text fontSize={16}>{option.label}</Text>
                <Switch
                  size="sm"
                  isChecked={notifications[option.id]}
                  onValueChange={() => toggleNotification(option.id)}
                />
              </HStack>
            ))}
          </VStack>
        </VStack>
      </SafeAreaView>
    </>
  );
}
