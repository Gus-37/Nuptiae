import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function RegisterPush() {
  const navigation = useNavigation();

  const handleContinue = () => {
    navigation.replace("HomeDrawer");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos sobre la boda</Text>

      <Text style={styles.label}>Fecha tentativa o próxima a la boda</Text>
      
      <View style={styles.notificationCard}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        <Text style={styles.notificationTitle}>
          ¡Concédenos el permiso de tu código en configuración de cuentas para enviar notificaciones!
        </Text>
        <Text style={styles.notificationCode}>345</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleContinue}
      >
        <Text style={styles.primaryButtonText}>Registrarte</Text>
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
    marginBottom: 16,
  },
  notificationCard: {
    backgroundColor: "#ff6b6b",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 32,
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
    marginBottom: 16,
    lineHeight: 22,
  },
  notificationCode: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
