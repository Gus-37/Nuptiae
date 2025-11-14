import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterStep2() {
  const navigation = useNavigation();
  const [weddingDate, setWeddingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [role, setRole] = useState("");
  const [accountCode, setAccountCode] = useState("");

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

      <Text style={styles.label}>Rol</Text>
      <TextInput
        placeholder="Selecciona tu rol en la boda"
        value={role}
        onChangeText={setRole}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Código de cuenta duo (opcional)</Text>
      <TextInput
        placeholder="Ingresa el código de la cuenta duo"
        value={accountCode}
        onChangeText={setAccountCode}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("RegisterPush")}
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
