import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarAgendaScreen from './CalendarAgendaScreen';
import TareasScreen from './TareasScreen';
import PreparativosScreen from './PreparativosScreen';
import { useUISettings } from '../context/UISettingsContext';

export default function AgendaScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [activeTab, setActiveTab] = useState('calendario');

  const renderScreen = () => {
    switch (activeTab) {
      case 'calendario':
        return <CalendarAgendaScreen hideHeader={true} />;
      case 'tareas':
        return <TareasScreen navigation={navigation} hideHeader={true} />;
      case 'preparativos':
        return <PreparativosScreen navigation={navigation} hideHeader={true} />;
      default:
        return <CalendarAgendaScreen hideHeader={true} />;
    }
  };

  const tabs = [
    { id: 'calendario', label: 'Calendario', icon: 'calendar' },
    { id: 'tareas', label: 'Tareas', icon: 'checkmark-done' },
    { id: 'preparativos', label: 'Preparativos', icon: 'clipboard' },
  ];

  const handleAddPreparativo = () => {
    navigation.navigate('AddPreparativo', {
      onAddPreparativo: (newPreparativo) => {
        // El onValue listener actualizará el estado automáticamente
      },
    });
  };

  const handleAddTarea = () => {
    navigation.navigate('AddTarea', {
      onAddTarea: (newTarea) => {
        // El onValue listener actualizará el estado automáticamente
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Pestañas horizontales */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? colors.accent : colors.muted}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: colors.muted, fontSize: 12 * fontScale },
                activeTab === tab.id && { color: colors.accent, fontWeight: '600' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido de la pantalla activa */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* FAB para agregar tarea */}
      {activeTab === 'tareas' && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={handleAddTarea}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* FAB para agregar preparativo */}
      {activeTab === 'preparativos' && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={handleAddPreparativo}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#ff6b6b',
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
