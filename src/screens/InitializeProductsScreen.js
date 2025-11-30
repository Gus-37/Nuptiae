import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { initializeSampleProducts } from "../services/productsService";

export default function InitializeProductsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      await initializeSampleProducts();
      Alert.alert(
        "Éxito",
        "Los productos se han inicializado correctamente en Firebase",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al inicializar los productos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Inicializar Base de Datos</Text>
        <Text style={styles.description}>
          Esta acción creará productos de ejemplo en Firebase Realtime Database.
          {"\n\n"}
          Solo debes ejecutar esto una vez.
        </Text>
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleInitialize}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Inicializando..." : "Inicializar Productos"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
  },
});
