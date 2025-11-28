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
import { useUISettings } from "../context/UISettingsContext";

export default function InvitadosScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const [selectedTab, setSelectedTab] = useState("roles");

  const guests = [
    { id: 1, name: "Mauricio Rivera", role: "Padrino de anillos" },
    { id: 2, name: "Omar Mendoza", role: "Invitado de honor" },
    { id: 3, name: "Diego Zamora", role: "Invitado especial" },
    { id: 4, name: "Belén Ibarra", role: "Madrina de flores" },
    { id: 5, name: "Zoe Montserat", role: "Niña de las flores" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}
>
          <TouchableOpacity onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Invitados</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "roles" && { borderBottomColor: colors.accent }]
}
            onPress={() => setSelectedTab("roles")}
          >
            <Users size={20} color={selectedTab === "roles" ? colors.accent : colors.muted} />
            <Text style={[
              styles.tabText, 
              { color: colors.muted, fontSize: 14 * fontScale },
              selectedTab === "roles" && { color: colors.accent, fontWeight: "600" }
            ]}>
              Roles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "itinerario" && { borderBottomColor: colors.accent }]
}
            onPress={() => setSelectedTab("itinerario")}
          >
            <List size={20} color={selectedTab === "itinerario" ? colors.accent : colors.muted} />
            <Text style={[
              styles.tabText,
              { color: colors.muted, fontSize: 14 * fontScale },
              selectedTab === "itinerario" && { color: colors.accent, fontWeight: "600" }
            ]}>
              Itinerario
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            {guests.map((guest) => (
              <View key={guest.id} style={[styles.guestCard, { backgroundColor: colors.card, borderColor: colors.border }]}
>
                <View style={[styles.avatar, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#2A2A2A' }]}
>
                  <Text style={[styles.avatarText, { color: colors.muted }]}>{guest.name.charAt(0)}</Text>
                </View>
                <View style={styles.guestInfo}>
                  <Text style={[styles.guestName, { color: colors.text, fontSize: 15 * fontScale }]}>{guest.name}</Text>
                  <Text style={[styles.guestRole, { color: colors.muted, fontSize: 13 * fontScale }]}>{guest.role}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.getParent()?.navigate('AddInvitado', {
            onSave: (newGuest) => {
              console.log('Nuevo invitado:', newGuest);
            }
          })}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <Home size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Costos", { tab: "compras" })}
          >
            <ShoppingCart size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
            <Calendar size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuentas")}>
            <Users size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
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
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
  },
  guestInfo: {
    flex: 1,
  },
  guestName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  guestRole: {
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
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
    borderTopWidth: 1,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
});
