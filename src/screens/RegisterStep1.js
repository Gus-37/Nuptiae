import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUISettings } from "../context/UISettingsContext";

export default function RegisterStep1() {
  const { colors, fontScale, theme } = useUISettings();
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
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: 24 * fontScale }]}>Registro de datos personales</Text>

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Nombre</Text>
      <TextInput
        placeholder="Ingresa tu nombre"
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
      />

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Fecha de nacimiento</Text>
      <TouchableOpacity 
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateText, { color: colors.text, fontSize: 16 * fontScale }]}>{formatDate(birthDate)}</Text>
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

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Género</Text>
      <TouchableOpacity 
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => setShowGenderPicker(true)}
      >
        <Text style={[styles.dateText, { color: gender ? colors.text : colors.muted, fontSize: 16 * fontScale }, !gender && styles.placeholder]}>
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
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Selecciona tu género</Text>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => {
                setGender('Masculino');
                setShowGenderPicker(false);
              }}
            >
              <Text style={[styles.modalOptionText, { color: colors.text, fontSize: 16 * fontScale }]}>🤵 Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: colors.border }]}
              onPress={() => {
                setGender('Femenino');
                setShowGenderPicker(false);
              }}
            >
              <Text style={[styles.modalOptionText, { color: colors.text, fontSize: 16 * fontScale }]}>👰 Femenino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.accent, fontSize: 16 * fontScale }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Número celular</Text>
      <TextInput
        placeholder="Ingresa tu número de teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
      />

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Código de cuenta duo (opcional)</Text>
      <TextInput
        placeholder="Ingresa el código si tu pareja ya se registró"
        value={accountCode}
        onChangeText={setAccountCode}
        keyboardType="number-pad"
        maxLength={6}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
      />
      <Text style={[styles.hintText, { color: colors.muted, fontSize: 12 * fontScale }]}>
        Si tienes un código de tu pareja, ingrésalo aquí. Si no, déjalo vacío.
      </Text>

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
  hintText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 12,
  },
});
