import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  Pressable,
  Fab,
  FabIcon,
} from '@gluestack-ui/themed';
import { Menu, ChevronRight, Plus } from 'lucide-react-native';

const ItinerarioScreen = () => {
  const itinerarioItems = [
    { time: '2:00 PM', title: 'Ceremonia en', subtitle: 'iglesia' },
    { time: '4:00 PM', title: 'Recepción en', subtitle: 'salón de fiesta' },
    { time: '5:00 PM', title: 'Presentación de', subtitle: 'los novios' },
    { time: '6:00 PM', title: 'Banquete', subtitle: '' },
    { time: '10:00 PM', title: 'Despedida de los', subtitle: 'novios' },
  ];

  return (
    <Box flex={1} bg="$white">
      {/* Header */}
      <HStack
        px="$4"
        py="$4"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="$gray200"
      >
        <Pressable mr="$3">
          <Icon as={Menu} size="xl" color="$black" />
        </Pressable>
        <Text fontSize="$xl" fontWeight="$semibold" color="$black">
          Invitados
        </Text>
      </HStack>

      {/* Tabs */}
      <HStack px="$4" py="$3" justifyContent="space-around">
        <Pressable flex={1} alignItems="center" py="$2">
          <Text fontSize="$md" color="$gray600">
            Roles
          </Text>
        </Pressable>
        <Pressable
          flex={1}
          alignItems="center"
          py="$2"
          borderBottomWidth={2}
          borderBottomColor="$red500"
        >
          <Text fontSize="$md" color="$black" fontWeight="$medium">
            Itinerario
          </Text>
        </Pressable>
      </HStack>

      {/* Itinerario List */}
      <ScrollView>
        <VStack px="$4" py="$2">
          {itinerarioItems.map((item, index) => (
            <Pressable key={index}>
              <HStack
                py="$4"
                alignItems="center"
                borderBottomWidth={1}
                borderBottomColor="$gray200"
              >
                <Text fontSize="$lg" fontWeight="$medium" width={80} color="$black">
                  {item.time}
                </Text>
                <VStack flex={1} ml="$2">
                  <Text fontSize="$md" color="$black">
                    {item.title}
                  </Text>
                  {item.subtitle !== '' && (
                    <Text fontSize="$md" color="$black">
                      {item.subtitle}
                    </Text>
                  )}
                </VStack>
                <Icon as={ChevronRight} size="xl" color="$gray400" />
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>

      {/* FAB */}
      <Fab
        size="lg"
        placement="bottom right"
        bg="$red400"
        mb="$6"
        mr="$4"
      >
        <FabIcon as={Plus} color="$white" />
      </Fab>
    </Box>
  );
};

export default ItinerarioScreen;