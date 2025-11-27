import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterStep2() {
  const navigation = useNavigation();
  const route = useRoute();
  const step1Data = route.params?.step1Data || {};
  
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [role, setRole] = useState("");

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || weddingDate;
    setShowDatePicker(Platform.OS === 'ios');
    setWeddingDate(currentDate);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleNext = () => {
    if (!role) {
      Alert.alert("Campo requerido", "Por favor selecciona tu rol en la boda");
      return;
    }

    navigation.navigate("RegisterPush", {
      step1Data,
      step2Data: {
        weddingDate: weddingDate.toISOString(),
        role
      },
      hasCode: false
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos sobre la boda</Text>

      <Text style={styles.label}>Fecha tentativa o próxima a la boda</Text>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(weddingDate)}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={weddingDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Rol en la boda</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Novia' && styles.roleButtonActive]}
          onPress={() => setRole('Novia')}
        >
          <Text style={[styles.roleText, role === 'Novia' && styles.roleTextActive]}>👰 Novia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'Novio' && styles.roleButtonActive]}
          onPress={() => setRole('Novio')}
        >
          <Text style={[styles.roleText, role === 'Novio' && styles.roleTextActive]}>🤵 Novio</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleNext}
      >
        <Text style={styles.primaryButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  roleText: {
    fontSize: 16,
    color: '#333',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fafafa",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  primaryButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
