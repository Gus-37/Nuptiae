import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { registerUser } from "../services/authService";

export default function RegisterPush() {
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
    <View style={styles.container}>
      <Text style={styles.title}>{hasCode ? "Únete a la cuenta" : "Completa tu registro"}</Text>
      {hasCode && (
        <Text style={styles.subtitle}>
          Te unirás a la cuenta con código: {step1Data?.accountCode}
        </Text>
      )}

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        placeholder="Ingresa tu correo"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        placeholder="Ingresa tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
        editable={!loading}
      />

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <TextInput
        placeholder="Confirma tu contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
        editable={!loading}
      />
      
      <View style={styles.notificationCard}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        <Text style={styles.notificationTitle}>
          ¡Concédenos el permiso de tu código en configuración de cuentas para enviar notificaciones!
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.disabledButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Registrarte</Text>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
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
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: "#ff6b6b",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
    marginTop: 12,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  notificationTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

