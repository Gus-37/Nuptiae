import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Home, ShoppingCart, Calendar, Users, Plus, X, ChevronRight } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";
import { ref, push, onValue, remove } from "firebase/database";
import { invitadosDatabase, auth } from "../config/firebaseConfig";
import { useLanguage } from "../context/LanguageContext";

export default function InvitadosScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const { t } = useLanguage();
  const [guests, setGuests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", role: "" });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("No hay usuario autenticado");
      return;
    }

    const guestsRef = ref(invitadosDatabase, `guests/${userId}`);
    onValue(guestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const guestsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setGuests(guestsList);
      } else {
        setGuests([]);
      }
    });
  };

  const addGuest = async () => {
    if (!newGuest.name.trim() || !newGuest.role.trim()) {
      Alert.alert(t("error"), t("completeFields"));
      return;
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert(t("error"), t("mustLogin"));
        return;
      }

      const guestsRef = ref(invitadosDatabase, `guests/${userId}`);
      await push(guestsRef, {
        name: newGuest.name.trim(),
        role: newGuest.role.trim(),
        createdAt: new Date().toISOString()
      });
      
      setNewGuest({ name: "", role: "" });
      setModalVisible(false);
      Alert.alert(t("success"), t("guestAdded"));
    } catch (error) {
      console.error("Error adding guest:", error);
      Alert.alert(t("error"), t("guestAddError", error.message));
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}
          >
            {t("guests")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            {guests.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.muted, fontSize: 14 * fontScale }]}>
                {t("noGuests")}
              </Text>
            ) : (
              guests.map((guest) => (
                <View key={guest.id} style={[styles.guestCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.avatar, { backgroundColor: theme === 'light' ? '#E8E8E8' : '#2A2A2A' }]}>
                    <Text style={[styles.avatarText, { color: colors.muted }]}>{guest.name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.guestInfo}>
                    <Text style={[styles.guestName, { color: colors.text, fontSize: 15 * fontScale }]}>{guest.name}</Text>
                    <Text style={[styles.guestRole, { color: colors.muted, fontSize: 13 * fontScale }]}>{guest.role}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.muted} />
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.accent }]}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Add Guest Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text, fontSize: 18 * fontScale }]}>
                  {t("addGuest")}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text, fontSize: 14 * fontScale }]}>
                  {t("guestName")}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.bg, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontSize: 16 * fontScale
                  }]}
                  placeholder={t("guestNamePlaceholder")}
                  placeholderTextColor={colors.muted}
                  value={newGuest.name}
                  onChangeText={(text) => setNewGuest({ ...newGuest, name: text })}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text, fontSize: 14 * fontScale }]}>
                  {t("guestRole")}
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.bg, 
                    color: colors.text, 
                    borderColor: colors.border,
                    fontSize: 16 * fontScale
                  }]}
                  placeholder={t("guestRolePlaceholder")}
                  placeholderTextColor={colors.muted}
                  value={newGuest.role}
                  onChangeText={(text) => setNewGuest({ ...newGuest, role: text })}
                />
              </View>

              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colors.accent }]}
                onPress={addGuest}
              >
                <Text style={[styles.addButtonText, { fontSize: 16 * fontScale }]}>
                  {t("add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    paddingBottom: 100,
  },
  guestCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
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
  emptyText: {
    textAlign: "center",
    marginTop: 40,
  },
});
