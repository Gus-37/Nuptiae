import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterStep1() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [accountCode, setAccountCode] = useState("");

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleNext = () => {
    if (!name || !gender || !phone) {
      Alert.alert("Campos requeridos", "Por favor completa todos los campos");
      return;
    }

    const step1Data = {
      name,
      birthDate: birthDate.toISOString(),
      gender,
      phone,
      accountCode: accountCode.trim()
    };

    // Si tiene código, salta directo a RegisterPush (sin datos de boda)
    if (accountCode.trim()) {
      navigation.navigate("RegisterPush", {
        step1Data,
        hasCode: true
      });
    } else {
      // Si no tiene código, va a Step2 (datos de boda)
      navigation.navigate("RegisterStep2", {
        step1Data
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de datos personales</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Género</Text>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowGenderPicker(true)}
      >
        <Text style={[styles.dateText, !gender && styles.placeholder]}>
          {gender || "Selecciona tu género"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona tu género</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setGender('Masculino');
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.modalOptionText}>🤵 Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setGender('Femenino');
                setShowGenderPicker(false);
              }}
            >
              <Text style={styles.modalOptionText}>👰 Femenino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.label}>Número celular</Text>
      <TextInput
        placeholder="Ingresa tu número de teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Código de cuenta duo (opcional)</Text>
      <TextInput
        placeholder="Ingresa el código si tu pareja ya se registró"
        value={accountCode}
        onChangeText={setAccountCode}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <Text style={styles.hintText}>
        Si tienes un código de tu pareja, ingrésalo aquí. Si no, déjalo vacío.
      </Text>

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
  placeholder: {
    color: "#999",
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
  hintText: {
    fontSize: 12,
    color: "#999",
    marginTop: -12,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 12,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    fontWeight: '600',
  },
});
