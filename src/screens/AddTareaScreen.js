// src/screens/AddTareaScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { push, ref, update } from 'firebase/database';
import { databaseAgendas } from '../config/firebaseAgendas';
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";

export default function AddTareaScreen({ navigation, route }) {
  const { onAddTarea, editMode = false, task, onUpdate } = route.params || {};

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Importante");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // If in edit mode, prefill fields
  useEffect(() => {
    if (editMode && task) {
      setTitle(task.title || '');
      setPriority(task.priority || 'Importante');
      setDueDate(task.dueDate ? new Date(task.dueDate) : new Date());
    } else {
      setDueDate(new Date());
    }
  }, [editMode, task]);

  const priorities = [
    { label: "Urgente", value: "Urgente", color: "#f08080" },
    { label: "Importante", value: "Importante", color: "#ff6b6b" },
    { label: "Puede esperar", value: "Puede esperar", color: "#ffa500" },
  ];

  // Detecta orientación actual
  const window = Dimensions.get("window");
  const [isLandscape, setIsLandscape] = useState(window.width > window.height);

  // Listener cuando cambia orientación
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsLandscape(window.width > window.height);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Habilitar rotación solo en esta pantalla
  useFocusEffect(
    useCallback(() => {
      (async () => {
        await ScreenOrientation.unlockAsync();
      })();

      return () => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      };
    }, [])
  );

  // Manejar cambio de fecha desde DateTimePicker
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  // Cerrar DateTimePicker en iOS
  const handleDatePickerConfirm = () => {
    setShowDatePicker(false);
  };

  const handleAddTarea = () => {
    if (title.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un título para la tarea");
      return;
    }
    const payload = {
      title: title.trim(),
      priority,
      color: priorities.find((p) => p.value === priority)?.color || "#f08080",
      dueDate: dueDate.getTime(), // Guardar como timestamp
      // when editing, keep existing completed state if present
      completed: task?.completed ?? false,
      createdAt: task?.createdAt ?? Date.now(),
    };

    if (editMode && task && task.id) {
      // Update existing task
      try {
        const taskRef = ref(databaseAgendas, `agenda/tasks/${task.id}`);
        update(taskRef, payload);
        if (onUpdate) onUpdate({ ...payload, id: task.id });
        Alert.alert("Éxito", "Tarea actualizada correctamente", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } catch (err) {
        console.warn('Error actualizando tarea en Firebase:', err);
        Alert.alert('Error', 'No se pudo actualizar la tarea');
      }
      return;
    }

    // Create new task
    try {
      const newRef = push(ref(databaseAgendas, 'agenda/tasks'), payload);
      const generatedId = newRef?.key;
      if (onAddTarea) onAddTarea({ ...payload, id: generatedId });
      Alert.alert("Éxito", "Tarea agregada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.warn('Error guardando tarea en Firebase:', err);
      if (onAddTarea) onAddTarea(payload);
      Alert.alert('Error', 'No se pudo guardar la tarea');
    }
  };

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isLandscape && styles.scrollLandscape]}
      >
        {/* Header */}
        <View style={[styles.header, isLandscape && styles.headerLandscape]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editMode ? 'Editar Tarea' : 'Nueva Tarea'}</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Contenido */}
        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          {/* Campo título */}
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

          {/* Selector de Fecha */}
          <View style={styles.section}>
            <Text style={styles.label}>Fecha Vencimiento</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={20} color="#ff6b6b" style={{ marginRight: 10 }} />
              <Text style={styles.dateButtonText}>
                {dueDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </TouchableOpacity>
            
            {/* DateTimePicker */}
            {showDatePicker && (
              <>
                {Platform.OS === 'ios' && (
                  <Modal
                    transparent
                    animationType="slide"
                    visible={showDatePicker}
                    onRequestClose={handleDatePickerConfirm}
                  >
                    <View style={styles.datePickerModalOverlay}>
                      <View style={styles.datePickerModalContent}>
                        <View style={styles.datePickerHeader}>
                          <TouchableOpacity onPress={handleDatePickerConfirm}>
                            <Text style={styles.datePickerButton}>Listo</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={dueDate}
                          mode="date"
                          display="spinner"
                          onChange={handleDateChange}
                          locale="es-ES"
                        />
                      </View>
                    </View>
                  </Modal>
                )}
                
                {Platform.OS === 'android' && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    locale="es-ES"
                  />
                )}
              </>
            )}
          </View>

          {/* Selección de prioridad */}
          <View style={[styles.section, isLandscape && styles.priorityLandscape]}>
            <Text style={styles.label}>Prioridad</Text>

            <View style={[styles.priorityContainer, isLandscape && styles.priorityContainerLandscape]}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityButton,
                    priority === p.value && styles.priorityButtonActive,
                    { borderColor: p.color },
                  ]}
                  onPress={() => setPriority(p.value)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === p.value && styles.priorityButtonTextActive,
                    ]}
                  >
                    {p.label}
                  </Text>
                  {priority === p.value && (
                    <Ionicons name="checkmark" size={20} color={p.color} style={{ marginLeft: "auto" }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={20} color="#999" />
            <Text style={styles.infoText}>
              Las tareas se agregarán a tu lista y aparecerán en la vista de Tareas.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botones */}
      <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, title.trim() === "" && styles.addButtonDisabled]}
          onPress={handleAddTarea}
          disabled={title.trim() === ""}
        >
          <Ionicons name="add" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Agregar Tarea</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ───────────────────────────── STYLES ───────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerLandscape: {
    flexDirection: "row",
  },

  scrollContent: {
    flexGrow: 1,
  },
  scrollLandscape: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerLandscape: {
    justifyContent: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentLandscape: {
    paddingHorizontal: 30,
  },

  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
  },
  dateButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  dateHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    fontStyle: "italic",
  },

  priorityContainer: {
    gap: 10,
  },
  priorityContainerLandscape: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#f9f9f9",
  },
  priorityButtonActive: {
    backgroundColor: "#fff",
    borderColor: "#f08080",
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityButtonText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  priorityButtonTextActive: {
    color: "#333",
    fontWeight: "600",
  },

  infoSection: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  buttonContainerLandscape: {
    width: "100%",
    justifyContent: "center",
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },

  addButton: {
    flex: 1.5,
    paddingVertical: 14,
    backgroundColor: "#f08080",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  datePickerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
});
