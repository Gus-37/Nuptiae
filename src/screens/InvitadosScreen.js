import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Users, List, Plus, ArrowLeft, Calendar, Home, ShoppingCart } from "lucide-react-native";

export default function InvitadosScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("roles");

  const guests = [
    { id: 1, name: "Mauricio Rivera", role: "Padrino de anillos" },
    { id: 2, name: "Omar Mendoza", role: "Invitado de honor" },
    { id: 3, name: "Diego Zamora", role: "Invitado especial" },
    { id: 4, name: "Belén Ibarra", role: "Madrina de flores" },
    { id: 5, name: "Zoe Montserat", role: "Niña de las flores" },
  ];

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
          <Text style={styles.headerTitle}>Invitados</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "roles" && styles.tabActive]}
            onPress={() => setSelectedTab("roles")}
          >
            <Users size={20} color={selectedTab === "roles" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "roles" && styles.tabTextActive]}>
              Roles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "itinerario" && styles.tabActive]}
            onPress={() => setSelectedTab("itinerario")}
          >
            <List size={20} color={selectedTab === "itinerario" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "itinerario" && styles.tabTextActive]}>
              Itinerario
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            {guests.map((guest) => (
              <View key={guest.id} style={styles.guestCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{guest.name.charAt(0)}</Text>
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName} numberOfLines={1}>{guest.name}</Text>
                  <Text style={styles.guestRole} numberOfLines={1}>{guest.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.getParent()?.navigate('AddInvitado', {
            onSave: (newGuest) => {
              console.log('Nuevo invitado:', newGuest);
            }
          })}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>

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
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuentas")}>
            <Users size={24} color="#666" />
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
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff6b6b",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  tabTextActive: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 100,
  },
  guestCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  guestRole: {
    fontSize: 13,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff6b6b",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
});
