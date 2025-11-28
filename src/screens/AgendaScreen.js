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
        return <PreparativosScreen hideHeader={true} />;
      default:
        return <CalendarAgendaScreen hideHeader={true} />;
    }
  };

  const tabs = [
    { id: 'calendario', label: 'Calendario', icon: 'calendar' },
    { id: 'tareas', label: 'Tareas', icon: 'checkmark-done' },
    { id: 'preparativos', label: 'Preparativos', icon: 'clipboard' },
  ];

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
});
