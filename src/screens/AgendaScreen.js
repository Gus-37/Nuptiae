import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  Calendar as CalendarIcon,
  CheckSquare,
  Briefcase,
  Plus,
  ArrowLeft,
  Users,
  ShoppingCart,
  DollarSign,
  Home,
  Clock
} from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";

export default function AgendaScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const [selectedTab, setSelectedTab] = useState("tareas");
  const [currentMonth] = useState(new Date(2025, 8));
  const [menuVisible, setMenuVisible] = useState(false);

  const eventos = [
    { id: 1, title: "Cita con planificador", date: "2025-12-01", time: "10:00 AM" },
    { id: 2, title: "Prueba de vestido", date: "2025-12-05", time: "2:00 PM" },
    { id: 3, title: "Reunión con DJ", date: "2025-12-10", time: "4:30 PM" },
  ];

  const renderEvento = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.eventoCard,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colors.accent + "22" }]}>
        <CalendarIcon size={20} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.eventoTitle, { color: colors.text, fontSize: 16 * fontScale }]}>
          {item.title}
        </Text>
        <View style={styles.eventoMeta}>
          <Text style={[styles.eventoDate, { color: colors.muted, fontSize: 13 * fontScale }]}>
            {item.date}
          </Text>
          <View style={styles.timeBadge}>
            <Clock size={12} color={colors.muted} />
            <Text style={[styles.eventoTime, { color: colors.muted, fontSize: 12 * fontScale }]}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isHighlighted = day === 2;
      days.push(
        <TouchableOpacity key={day} style={styles.calendarDay}>
          <View
            style={[
              styles.dayCircle,
              isHighlighted && { backgroundColor: colors.accent }
            ]}
          >
            <Text
              style={[
                styles.dayText,
                { color: colors.text, fontSize: 13 * fontScale },
                isHighlighted && { color: colors.bg, fontWeight: "700" }
              ]}
            >
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <Text style={{ color: colors.text, fontSize: 18 * fontScale, fontWeight: "600", marginBottom: 12 }}>
          {monthNames[currentMonth.getMonth()]}
        </Text>
        <View style={styles.calendarHeader}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <Text
              key={i}
              style={{ color: colors.muted, fontSize: 12 * fontScale, fontWeight: "600", textAlign: "center" }}
            >
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>{days}</View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === "light" ? "dark-content" : "light-content"} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home")}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ color: colors.text, fontSize: 18 * fontScale, fontWeight: "600" }}>Agenda</Text>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Menu size={24} color={colors.text} />
            </TouchableOpacity>
        </View>

        {/* Modal Menu */}
        <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
            <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
              {[
                { icon: ShoppingCart, label: "Compras", tab: "compras" },
                { icon: CheckSquare, label: "Carrito", tab: "carrito" },
                { icon: DollarSign, label: "Presupuesto", tab: "presupuesto" },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("Costos", { tab: item.tab });
                  }}
                >
                  <item.icon size={20} color={colors.accent} />
                  <Text style={{ color: colors.text, fontSize: 15 * fontScale }}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tabs */}
        <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
          {[
            { key: "tareas", label: "Tareas", icon: CheckSquare },
            { key: "calendario", label: "Calendario", icon: CalendarIcon },
            { key: "preparativos", label: "Preparativos", icon: Briefcase },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                selectedTab === tab.key && { borderBottomColor: colors.accent, borderBottomWidth: 2 }
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <tab.icon size={20} color={selectedTab === tab.key ? colors.accent : colors.muted} />
              <Text
                style={{
                  color: selectedTab === tab.key ? colors.accent : colors.muted,
                  fontSize: 14 * fontScale,
                  fontWeight: selectedTab === tab.key ? "600" : "500"
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedTab === "tareas" && (
            <View style={styles.section}>
              <FlatList
                data={eventos}
                renderItem={renderEvento}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}

            {selectedTab === "calendario" && (
              <View style={styles.section}>
                {renderCalendar()}
              </View>
            )}

          {selectedTab === "preparativos" && (
            <View style={styles.section}>
              <Text style={{ color: colors.text, fontSize: 16 * fontScale, fontWeight: "600", marginBottom: 10 }}>
                Preparativos iniciales
              </Text>
              <Text style={{ color: colors.muted, fontSize: 14 * fontScale, lineHeight: 20 }}>
                ✨ Establecer presupuesto, contratar proveedores, organizar invitados y más...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Add (solo ejemplo) */}
        {selectedTab === "tareas" && (
          <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <Home size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Costos")}>
            <ShoppingCart size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <CalendarIcon size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuentas")}>
            <Users size={24} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6
  },
  content: { flex: 1 },
  section: { padding: 20 },
  eventoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  eventoTitle: { fontWeight: "600", marginBottom: 6 },
  eventoMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  timeBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 4
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  calendarDay: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4
  },
  dayCircle: {
    width: "78%",
    height: "78%",
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center"
  },
  dayText: { fontWeight: "500" },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1
  },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-start"
  },
  menuContainer: {
    borderRadius: 12,
    marginTop: 70,
    marginLeft: 16,
    paddingVertical: 8,
    minWidth: 220
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12
  }
});
