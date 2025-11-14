import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Mail, Apple } from "lucide-react-native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Nuptiae</Text>
      <Text style={styles.subtitle}>Inicia sesión para comenzar</Text>

      <TextInput
        placeholder="Usuario o Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { marginBottom: 0 }]}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.replace("HomeDrawer")}
      >
        <Text style={styles.primaryButtonText}>Inicia Sesión</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>O</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Mail size={20} color="#333" style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>Continúa con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.appleButton}>
        <Apple size={20} color="#333" style={styles.socialIcon} />
        <Text style={styles.appleButtonText}>Continúa con Apple</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterStep1")}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  passwordContainer: {
    marginBottom: 8,
  },
  forgotPassword: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
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
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  appleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  registerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    width: '100%',
  },
  registerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  registerLink: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
});
