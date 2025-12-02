import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Mail, Apple } from "lucide-react-native";
import { loginUser } from "../services/authService";
import { useUISettings } from "../context/UISettingsContext";

export default function LoginScreen() {
  const { colors, fontScale, theme } = useUISettings();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      // Login exitoso
      navigation.replace("HomeDrawer");
    } else {
      Alert.alert("Error de inicio de sesión", result.error);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert("Email requerido", "Ingresa tu email para recuperar la contraseña");
      return;
    }
    // Aquí puedes agregar la funcionalidad de resetPassword
    Alert.alert("Recuperación", "Se enviará un correo de recuperación");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: 28 * fontScale }]}>Bienvenido a Nuptiae</Text>
      <Text style={[styles.subtitle, { color: colors.muted, fontSize: 16 * fontScale }]}>Inicia sesión para comenzar</Text>

      <TextInput
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        placeholderTextColor={colors.muted}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { marginBottom: 0, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholderTextColor={colors.muted}
          editable={!loading}
        />
      </View>

      <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
        <Text style={[styles.forgotPassword, { color: colors.accent, fontSize: 14 * fontScale }]}>¿Olvidaste la contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.accent }, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.primaryButtonText, { fontSize: 16 * fontScale }]}>Inicia Sesión</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.muted, fontSize: 14 * fontScale }]}>O</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity style={[styles.googleButton, { backgroundColor: colors.card, borderColor: colors.border }]} disabled>
        <Mail size={20} color={colors.muted} style={styles.socialIcon} />
        <Text style={[styles.socialButtonText, { color: colors.muted, fontSize: 16 * fontScale }]}>Continúa con Google (Próximamente)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.appleButton, { backgroundColor: colors.card, borderColor: colors.border }]} disabled>
        <Apple size={20} color={colors.muted} style={styles.socialIcon} />
        <Text style={[styles.appleButtonText, { color: colors.muted, fontSize: 16 * fontScale }]}>Continúa con Apple (Próximamente)</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterStep1")}>
          <Text style={[styles.registerText, { color: colors.text, fontSize: 14 * fontScale }]}>
            ¿No tienes cuenta? <Text style={[styles.registerLink, { color: colors.accent }]}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  appleButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontWeight: "600",
  },
  appleButtonText: {
    fontWeight: "600",
  },
  registerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: '100%',
  },
});
