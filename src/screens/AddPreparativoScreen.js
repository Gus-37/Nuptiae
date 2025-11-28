// src/screens/AddPreparativoScreen.js
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { push, ref, update } from 'firebase/database';
import { databaseAgendas } from '../config/firebaseAgendas';
import * as ScreenOrientation from "expo-screen-orientation";
import { useFocusEffect } from "@react-navigation/native";

export default function AddPreparativoScreen({ navigation, route }) {
  const { onAddPreparativo, editMode = false, preparativo, onUpdate } = route.params || {};

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#f08080");

  const colors = [
    { label: "Rojo", value: "#f08080" },
    { label: "Rojo oscuro", value: "#ff6b6b" },
    { label: "Naranja", value: "#ffa500" },
  ];

  // If in edit mode, prefill fields
  useEffect(() => {
    if (editMode && preparativo) {
      setCategory(preparativo.category || '');
      setDescription(preparativo.description || '');
      setColor(preparativo.color || '#f08080');
    }
  }, [editMode, preparativo]);

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

  const handleAddPreparativo = () => {
    if (category.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un título para el preparativo");
      return;
    }
    if (description.trim() === "") {
      Alert.alert("Error", "Por favor ingresa una descripción");
      return;
    }

    const payload = {
      category: category.trim(),
      description: description.trim(),
      color,
      createdAt: preparativo?.createdAt ?? Date.now(),
    };

    if (editMode && preparativo && preparativo.id) {
      // Update existing preparativo
      try {
        const prepRef = ref(databaseAgendas, `agenda/preparativos/${preparativo.id}`);
        update(prepRef, payload);
        if (onUpdate) onUpdate({ ...payload, id: preparativo.id });
        Alert.alert("Éxito", "Preparativo actualizado correctamente", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } catch (err) {
        console.warn('Error actualizando preparativo en Firebase:', err);
        Alert.alert('Error', 'No se pudo actualizar el preparativo');
      }
      return;
    }

    // Create new preparativo
    try {
      const newRef = push(ref(databaseAgendas, 'agenda/preparativos'), payload);
      const generatedId = newRef?.key;
      if (onAddPreparativo) onAddPreparativo({ ...payload, id: generatedId });
      Alert.alert("Éxito", "Preparativo agregado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.warn('Error guardando preparativo en Firebase:', err);
      if (onAddPreparativo) onAddPreparativo(payload);
      Alert.alert('Error', 'No se pudo guardar el preparativo');
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
          <Text style={styles.headerTitle}>{editMode ? 'Editar Preparativo' : 'Nuevo Preparativo'}</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Contenido */}
        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          {/* Campo categoría */}
          <View style={styles.section}>
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Elegir el lugar"
              placeholderTextColor="#ccc"
              value={category}
              onChangeText={setCategory}
              maxLength={80}
            />
            <Text style={styles.charCount}>{category.length}/80</Text>
          </View>

          {/* Campo descripción */}
          <View style={styles.section}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ej: Buscar un espacio que se ajuste a tu estilo y presupuesto"
              placeholderTextColor="#ccc"
              value={description}
              onChangeText={setDescription}
              maxLength={200}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          {/* Selección de color */}
          <View style={styles.section}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorContainer}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  style={[
                    styles.colorButton,
                    { backgroundColor: c.value },
                    color === c.value && styles.colorButtonActive,
                  ]}
                  onPress={() => setColor(c.value)}
                >
                  {color === c.value && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={20} color="#999" />
            <Text style={styles.infoText}>
              Los preparativos se agregarán a tu lista de cosas a considerar.
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
          style={[styles.addButton, (category.trim() === "" || description.trim() === "") && styles.addButtonDisabled]}
          onPress={handleAddPreparativo}
          disabled={category.trim() === "" || description.trim() === ""}
        >
          <Ionicons name="add" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>{editMode ? 'Actualizar' : 'Agregar'} Preparativo</Text>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },

  colorContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorButtonActive: {
    borderColor: '#333',
    borderWidth: 3,
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
});
