import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, ShoppingCart, DollarSign, List, ArrowLeft, Calendar, Users, Home } from "lucide-react-native";

export default function CostosScreen({ navigation, route }) {
  const [selectedTab, setSelectedTab] = useState("compras");
  const [menuVisible, setMenuVisible] = useState(false);

  // Recibir parámetros de navegación y establecer el tab correcto
  useEffect(() => {
    if (route.params?.tab) {
      setSelectedTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const items = [
    { id: 1, name: "Gemelos personalizados", detail: "3 pares", price: "$40.00" },
    { id: 2, name: "Gemelos personalizados", detail: "3 pares", price: "$40.00" },
    { id: 3, name: "Gemelos personalizados", detail: "3 pares", price: "$40.00" },
    { id: 4, name: "Gemelos personalizados", detail: "3 pares", price: "$40.00" },
    { id: 5, name: "Gemelos personalizados", detail: "3 pares", price: "$40.00" },
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
          <Text style={styles.headerTitle}>Costos y presupuesto</Text>
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
                  setSelectedTab("compras");
                  setMenuVisible(false);
                }}
              >
                <ShoppingCart size={20} color="#333" />
                <Text style={styles.menuItemText}>Compras</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSelectedTab("carrito");
                  setMenuVisible(false);
                }}
              >
                <List size={20} color="#333" />
                <Text style={styles.menuItemText}>Carrito</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSelectedTab("presupuesto");
                  setMenuVisible(false);
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
            style={[styles.tab, selectedTab === "compras" && styles.tabActive]}
            onPress={() => setSelectedTab("compras")}
          >
            <List size={20} color={selectedTab === "compras" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "compras" && styles.tabTextActive]}>
              Compras
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "carrito" && styles.tabActive]}
            onPress={() => setSelectedTab("carrito")}
          >
            <ShoppingCart size={20} color={selectedTab === "carrito" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "carrito" && styles.tabTextActive]}>
              Carrito
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "presupuesto" && styles.tabActive]}
            onPress={() => setSelectedTab("presupuesto")}
          >
            <DollarSign size={20} color={selectedTab === "presupuesto" ? "#ff6b6b" : "#666"} />
            <Text style={[styles.tabText, selectedTab === "presupuesto" && styles.tabTextActive]}>
              Presupuesto
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedTab === "compras" ? "Compras" : selectedTab === "carrito" ? "Carrito" : "Presupuesto"}
            </Text>

            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemDetail} numberOfLines={1}>{item.detail}</Text>
                </View>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>¿Aún tienes presupuesto suficiente?</Text>
              <Text style={styles.totalAmount}>$2,350.00</Text>
            </View>
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
            <ShoppingCart size={24} color="#ff6b6b" />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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
