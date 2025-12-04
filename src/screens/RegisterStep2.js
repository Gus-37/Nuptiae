import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUISettings } from "../context/UISettingsContext";

export default function RegisterStep2() {
  const { colors, fontScale, theme } = useUISettings();
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
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: 24 * fontScale }]}>Datos sobre la boda</Text>

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Fecha tentativa o próxima a la boda</Text>
      <TouchableOpacity 
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateText, { color: colors.text, fontSize: 16 * fontScale }]}>{formatDate(weddingDate)}</Text>
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

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Rol en la boda</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, { backgroundColor: colors.card, borderColor: colors.border }, role === 'Novia' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
          onPress={() => setRole('Novia')}
        >
          <Text style={[styles.roleText, { color: colors.text, fontSize: 16 * fontScale }, role === 'Novia' && { color: '#fff' }]}>👰 Novia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, { backgroundColor: colors.card, borderColor: colors.border }, role === 'Novio' && { backgroundColor: colors.accent, borderColor: colors.accent }]}
          onPress={() => setRole('Novio')}
        >
          <Text style={[styles.roleText, { color: colors.text, fontSize: 16 * fontScale }, role === 'Novio' && { color: '#fff' }]}>🤵 Novio</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.accent }]}
        onPress={handleNext}
      >
        <Text style={[styles.primaryButtonText, { fontSize: 16 * fontScale }]}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
