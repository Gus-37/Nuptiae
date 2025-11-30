import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarAgendaScreen from './CalendarAgendaScreen';
import TareasScreen from './TareasScreen';
import PreparativosScreen from './PreparativosScreen';

export default function AgendaScreen({ navigation }) {
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
    <View style={styles.container}>
      {/* Pestañas horizontales */}
      <View style={styles.tabsContainer}>
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
              color={activeTab === tab.id ? '#ff6b6b' : '#999'}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
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
          style={styles.fab}
          onPress={handleAddTarea}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* FAB para agregar preparativo */}
      {activeTab === 'preparativos' && (
        <TouchableOpacity
          style={styles.fab}
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
    backgroundColor: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    color: '#999',
  },
  tabLabelActive: {
    color: '#ff6b6b',
    fontWeight: '600',
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
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
