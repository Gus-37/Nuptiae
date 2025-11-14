import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddTareaScreen({ navigation, route }) {
  const { onAddTarea } = route.params || {};
  
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Importante');

  const priorities = [
    { label: 'Urgente', value: 'Urgente', color: '#f08080' },
    { label: 'Importante', value: 'Importante', color: '#ff6b6b' },
    { label: 'Puede esperar', value: 'Puede esperar', color: '#ffa500' },
  ];

  const handleAddTarea = () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un título para la tarea');
      return;
    }

    const newTarea = {
      id: Date.now(),
      title: title.trim(),
      priority: priority,
      color: priorities.find(p => p.value === priority)?.color || '#f08080',
      completed: false,
    };

    if (onAddTarea) {
      onAddTarea(newTarea);
    }

    Alert.alert('Éxito', 'Tarea agregada correctamente', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Tarea</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        
        {/* Campo de Título */}
        <View style={styles.section}>
          <Text style={styles.label}>Título de la Tarea</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Buscar vestuario"
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Seleccionar Prioridad */}
        <View style={styles.section}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityButton,
                  priority === p.value && styles.priorityButtonActive,
                  { borderColor: p.color }
                ]}
                onPress={() => setPriority(p.value)}
              >
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text style={[
                  styles.priorityButtonText,
                  priority === p.value && styles.priorityButtonTextActive
                ]}>
                  {p.label}
                </Text>
                {priority === p.value && (
                  <Ionicons name="checkmark" size={20} color={p.color} style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información */}
        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={20} color="#999" />
          <Text style={styles.infoText}>
            Las tareas se agregarán a tu lista y aparecerán en la vista de Tareas.
          </Text>
        </View>
      </View>

      {/* Botones de Acción */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, title.trim() === '' && styles.addButtonDisabled]}
          onPress={handleAddTarea}
          disabled={title.trim() === ''}
        >
          <Ionicons name="add" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  priorityContainer: {
    gap: 10,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  priorityButtonActive: {
    backgroundColor: '#fff',
    borderColor: '#f08080',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityButtonText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  priorityButtonTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  addButton: {
    flex: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f08080',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
