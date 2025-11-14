import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Calendar as CalendarIcon, CheckSquare, Briefcase, Plus, ArrowLeft, Users, ShoppingCart, DollarSign, Home } from "lucide-react-native";

export default function AgendaScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("calendario");
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // Septiembre 2025
  const [menuVisible, setMenuVisible] = useState(false);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                       "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isHighlighted = day === 2; // Highlight the 2nd day
      days.push(
        <TouchableOpacity key={day} style={styles.calendarDay}>
          <View style={[styles.dayCircle, isHighlighted && styles.dayHighlighted]}>
            <Text style={[styles.dayText, isHighlighted && styles.dayTextHighlighted]}>
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <Text style={styles.monthTitle}>{monthNames[currentMonth.getMonth()]}</Text>
        <View style={styles.calendarHeader}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>{days}</View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agenda</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Menu size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Costos", { tab: "compras" });
                }}
              >
                <ShoppingCart size={20} color="#333" />
                <Text style={styles.menuItemText}>Compras</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Costos", { tab: "carrito" });
                }}
              >
                <CheckSquare size={20} color="#333" />
                <Text style={styles.menuItemText}>Carrito</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Costos", { tab: "presupuesto" });
                }}
              >
                <DollarSign size={20} color="#333" />
                <Text style={styles.menuItemText}>Presupuesto</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "tareas" && styles.tabActive]}
            onPress={() => setSelectedTab("tareas")}
          >
            <CheckSquare size={20} color={selectedTab === "tareas" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "tareas" && styles.tabTextActive]}>
              Tareas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "calendario" && styles.tabActive]}
            onPress={() => setSelectedTab("calendario")}
          >
            <CalendarIcon size={20} color={selectedTab === "calendario" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "calendario" && styles.tabTextActive]}>
              Calendario
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "preparativos" && styles.tabActive]}
            onPress={() => setSelectedTab("preparativos")}
          >
            <Briefcase size={20} color={selectedTab === "preparativos" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "preparativos" && styles.tabTextActive]}>
              Preparativos
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {selectedTab === "tareas" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Próximas Tareas</Text>
              <View style={styles.taskCard}>
                <View style={styles.taskDot} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>Asignar maestro de ceremonias</Text>
                  <Text style={styles.taskSubtitle}>Fecha límite: 2035jun25</Text>
                </View>
              </View>
              <View style={styles.taskCard}>
                <View style={styles.taskDot} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>Lista de canciones nupciales</Text>
                  <Text style={styles.taskSubtitle}>Fecha límite: 3000/5/28</Text>
                </View>
              </View>
            </View>
          )}

          {selectedTab === "calendario" && (
            <View style={styles.section}>
              {renderCalendar()}
              <View style={{ marginTop: 30 }}>
                {renderCalendar()}
              </View>
            </View>
          )}

          {selectedTab === "preparativos" && (
            <View style={styles.section}>
              <View style={styles.preparativoCard}>
                <View style={styles.preparativoIcon}>
                  <View style={styles.redSquare} />
                </View>
                <Text style={styles.preparativoText}>
                  Establecer el presupuesto: Definir cuánto pueden gastar para tener una idea clara de las opciones.
                </Text>
              </View>
              <View style={styles.preparativoCard}>
                <View style={styles.preparativoIcon}>
                  <View style={styles.redSquare} />
                </View>
                <Text style={styles.preparativoText}>
                  Crear la lista de invitados: Decidir a quién invitar antes de buscar el lugar de la celebración.
                </Text>
              </View>
              <View style={styles.preparativoCard}>
                <View style={styles.preparativoIcon}>
                  <View style={styles.redSquare} />
                </View>
                <Text style={styles.preparativoText}>
                  Contratar proveedores clave: Reservar a tiempo el catering, el fotógrafo, el videógrafo y la DJ o banda.
                </Text>
              </View>
              <View style={styles.preparativoCard}>
                <View style={styles.preparativoIcon}>
                  <View style={styles.redSquare} />
                </View>
                <Text style={styles.preparativoText}>
                  Elegir fecha y lugar: Buscar un espacio para la ceremonia y la recepción que se ajuste a su estilo y al número de invitados.
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate("Tareas")}
              >
                <Plus size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
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
          <TouchableOpacity style={styles.navItem}>
            <CalendarIcon size={24} color="#ff6b6b" />
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    marginBottom: 12,
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff6b6b",
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayHighlighted: {
    backgroundColor: "#ff6b6b",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  dayTextHighlighted: {
    color: "#fff",
    fontWeight: "600",
  },
  responsableCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  responsableLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  responsableName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  preparativoCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  preparativoIcon: {
    marginRight: 12,
    paddingTop: 2,
  },
  redSquare: {
    width: 16,
    height: 16,
    backgroundColor: "#ff6b6b",
    borderRadius: 2,
  },
  preparativoText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
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
  calendarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 60,
    marginLeft: 16,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});
