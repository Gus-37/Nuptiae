import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { registerUser } from "../services/authService";
import { useUISettings } from "../context/UISettingsContext";

export default function RegisterPush() {
  const { colors, fontScale, theme } = useUISettings();
  const navigation = useNavigation();
  const route = useRoute();
  const { step1Data, step2Data, hasCode } = route.params || {};
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones
    if (!email || !password || !confirmPassword) {
      Alert.alert("Campos requeridos", "Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Preparar datos de usuario
    const userData = {
      name: step1Data?.name || "",
      birthDate: step1Data?.birthDate || "",
      gender: step1Data?.gender || "",
      phone: step1Data?.phone || "",
      weddingDate: step2Data?.weddingDate || "",
      role: step2Data?.role || "",
      accountCode: hasCode ? step1Data?.accountCode : (step2Data?.accountCode || "")
    };

    setLoading(true);
    const result = await registerUser(email, password, userData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        "¡Registro exitoso!",
        "Tu cuenta ha sido creada correctamente",
        [
          {
            text: "Continuar",
            onPress: () => navigation.replace("HomeDrawer")
          }
        ]
      );
    } else {
      Alert.alert("Error de registro", result.error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: 24 * fontScale }]}>{hasCode ? "Únete a la cuenta" : "Completa tu registro"}</Text>
      {hasCode && (
        <Text style={[styles.subtitle, { color: colors.muted, fontSize: 14 * fontScale }]}>
          Te unirás a la cuenta con código: {step1Data?.accountCode}
        </Text>
      )}

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Correo Electrónico</Text>
      <TextInput
        placeholder="Ingresa tu correo"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Contraseña</Text>
      <TextInput
        placeholder="Ingresa tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
        editable={!loading}
      />

      <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Confirmar Contraseña</Text>
      <TextInput
        placeholder="Confirma tu contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
        editable={!loading}
      />
      
      <View style={[styles.notificationCard, { backgroundColor: colors.accent }]}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { fontSize: 48 * fontScale }]}>🔔</Text>
        </View>
        <Text style={[styles.notificationTitle, { fontSize: 16 * fontScale }]}>
          ¡Concédenos el permiso de tu código en configuración de cuentas para enviar notificaciones!
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.accent }, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.primaryButtonText, { fontSize: 16 * fontScale }]}>Registrarte</Text>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
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
    fontSize: 16,
    marginBottom: 20,
  },
  notificationCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
    marginTop: 12,
  },
  iconContainer: {
    marginBottom: 16,
  },
  notificationTitle: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

