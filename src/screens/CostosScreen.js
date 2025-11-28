import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  ShoppingCart,
  DollarSign,
  List,
  ArrowLeft,
  Calendar,
  Users,
  Home,
  Plus,
  Trash2,
} from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";

export default function CostosScreen({ navigation, route }) {
  const { colors, fontScale, theme } = useUISettings();

  const [selectedTab, setSelectedTab] = useState("compras");
  const [menuVisible, setMenuVisible] = useState(false);

  const [presupuesto, setPresupuesto] = useState("50000");
  const [gastos, setGastos] = useState([
    { id: 1, concepto: "Salón", monto: "15000" },
    { id: 2, concepto: "Catering", monto: "12000" },
    { id: 3, concepto: "Fotografía", monto: "8000" },
  ]);

  const total = gastos.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);
  const restante = parseFloat(presupuesto || 0) - total;

  // Recibir parámetros para cambiar de tab desde otra pantalla
  useEffect(() => {
    if (route.params?.tab) {
      setSelectedTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const items = [
    { id: 1, name: "Gemelos personalizados", detail: "3 pares", price: "$40.00" },
    { id: 2, name: "Invitaciones", detail: "100 piezas", price: "$65.00" },
    { id: 3, name: "Recuerdos", detail: "50 piezas", price: "$120.00" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Costos y presupuesto</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Menu size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Menú Modal */}
        <Modal visible={menuVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
            <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
              {["compras", "carrito", "presupuesto"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.menuItem}
                  onPress={() => {
                    setSelectedTab(tab);
                    setMenuVisible(false);
                  }}
                >
                  {tab === "compras" && <ShoppingCart size={20} color={colors.text} />}
                  {tab === "carrito" && <List size={20} color={colors.text} />}
                  {tab === "presupuesto" && <DollarSign size={20} color={colors.text} />}
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
          {["compras", "carrito", "presupuesto"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              {tab === "compras" && <List size={20} color={selectedTab === tab ? colors.accent : colors.muted} />}
              {tab === "carrito" && <ShoppingCart size={20} color={selectedTab === tab ? colors.accent : colors.muted} />}
              {tab === "presupuesto" && <DollarSign size={20} color={selectedTab === tab ? colors.accent : colors.muted} />}
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedTab === tab ? colors.accent : colors.muted,
                    fontSize: 14 * fontScale,
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido según TAB */}
        <ScrollView style={styles.content}>
          {selectedTab !== "presupuesto" && (
            <View style={styles.section}>
              {items.map((item) => (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.itemImage} />
                  <View style={styles.itemContent}>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.itemDetail, { color: colors.muted }]}>{item.detail}</Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.text }]}>{item.price}</Text>
                </View>
              ))}
            </View>
          )}

          {selectedTab === "presupuesto" && (
            <View style={styles.section}>
              {/* Presupuesto Total */}
              <View style={[styles.budgetCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.label, { color: colors.muted }]}>Presupuesto Total</Text>
                <TextInput
                  style={[styles.budgetInput, { color: colors.text }]}
                  keyboardType="numeric"
                  value={presupuesto}
                  onChangeText={setPresupuesto}
                />
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryValue, { color: colors.accent }]}>Gastado: ${total.toLocaleString()}</Text>
                  <Text style={[styles.summaryValue, { color: restante >= 0 ? "#4ecdc4" : colors.accent }]}>
                    Restante: ${restante.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Gastos List */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Gastos</Text>
              {gastos.map((gasto) => (
                <View key={gasto.id} style={[styles.gastoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.gastoConcepto, { color: colors.text }]}>{gasto.concepto}</Text>
                  <Text style={[styles.gastoMonto, { color: colors.muted }]}>${gasto.monto}</Text>
                  <Trash2 size={20} color={colors.accent} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Home size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Costos", { tab: "compras" })}>
            <ShoppingCart size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Agenda")}>
            <Calendar size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Cuentas")}>
            <Users size={24} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* 🎨 Estilos */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontWeight: "600" },
  tabs: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2 },
  content: { flex: 1 },
  section: { padding: 20 },
  itemCard: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: "#f0f0f0", marginRight: 12 },
  itemContent: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemDetail: { fontSize: 13 },
  itemPrice: { fontSize: 16, fontWeight: "700" },
  budgetCard: { padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  budgetInput: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryValue: { fontSize: 16, fontWeight: "600" },
  gastoCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, borderTopWidth: 1 },
});
