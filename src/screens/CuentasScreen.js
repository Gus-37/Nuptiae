import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Users, ArrowLeft, ChevronRight, User, Lock, Activity, Globe, Monitor, Home, ShoppingCart, Calendar } from "lucide-react-native";

export default function CuentasScreen({ navigation }) {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accounts = [
    { id: 1, name: "Jessica", role: "Novia", avatar: "👰" },
    { id: 2, name: "Michael", role: "Novio", avatar: "🤵" },
  ];

  const menuOptions = [
    { id: 1, icon: User, label: "Editar Perfil", description: "Nombre, correo, foto de perfil", color: "#ff6b6b" },
    { id: 2, icon: Lock, label: "Cambiar Contraseña", description: "Actualiza tu contraseña de acceso", color: "#333" },
    { id: 3, icon: Activity, label: "Actividad Reciente", description: "Historial de acciones en la cuenta", color: "#333" },
    { id: 4, icon: Globe, label: "Idioma y Región", description: "Español, México", color: "#333" },
    { id: 5, icon: Monitor, label: "Configuración de Pantalla", description: "Tema, notificaciones, privacidad", color: "#333" },
  ];

  if (selectedAccount) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedAccount(null)}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cuenta</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarLarge}>{selectedAccount.avatar}</Text>
              </View>
              <Text style={styles.profileName}>{selectedAccount.name}</Text>
              <Text style={styles.profileRole}>{selectedAccount.role}</Text>
            </View>

            <View style={styles.menuSection}>
              {menuOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity 
                    key={option.id} 
                    style={styles.menuItem}
                    onPress={() => {
                      if (option.id === 4) {
                        navigation.navigate("Idioma");
                      } else if (option.id === 5) {
                        navigation.navigate("Pantalla");
                      }
                    }}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.iconCircle, option.id === 1 && styles.iconCircleHighlight]}>
                        <IconComponent size={20} color={option.color} />
                      </View>
                      <View style={styles.menuItemTextContainer}>
                        <Text style={styles.menuItemText}>{option.label}</Text>
                        <Text style={styles.menuItemDescription}>{option.description}</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#999" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
              <Home size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate("Costos", { tab: "compras" })}
            >
              <ShoppingCart size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
              <Calendar size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Users size={24} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuración de cuentas</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.accountNumber}>456</Text>
            <Text style={styles.accountLabel}>Código de cuenta dúo</Text>

            <View style={styles.accountsContainer}>
              {accounts.map((account) => (
                <TouchableOpacity 
                  key={account.id} 
                  style={styles.accountCard}
                  onPress={() => setSelectedAccount(account)}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>{account.avatar}</Text>
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountRole}>{account.role}</Text>
                  </View>
                  <ChevronRight size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.plannerButton}>
              <Text style={styles.plannerButtonText}>Planner de boda</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <Home size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Costos", { tab: "compras" })}
          >
            <ShoppingCart size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
            <Calendar size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Users size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
  },
  accountNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  accountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 40,
  },
  accountsContainer: {
    width: "100%",
    marginBottom: 40,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  accountRole: {
    fontSize: 14,
    color: "#666",
  },
  plannerButton: {
    backgroundColor: "#FFE5E5",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  plannerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b6b",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarLarge: {
    fontSize: 48,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: "#666",
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleHighlight: {
    backgroundColor: "#FFE5E5",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#999",
  },
});
