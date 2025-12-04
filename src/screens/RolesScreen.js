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
import { ArrowLeft, Plus, Calendar, Users, Home, ShoppingCart, MapPin } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";

export default function RolesScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();

  const [tasks, setTasks] = useState([
    { id: 1, title: "Elegir menú", completed: false },
    { id: 2, title: "Elegir música", completed: false },
    { id: 3, title: "Elegir decoración", completed: false },
    { id: 4, title: "Ayudar a recibir invitados", completed: false },
    { id: 5, title: "Apoyar con gastos", completed: false },
    { id: 6, title: "Apoyar con logística", completed: false },
    { id: 7, title: "Conducir el evento", completed: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const roles = [
    { id: 1, name: "Rol #1", price: "$1,500", image: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 2, name: "Rol #2", price: "$2,000", image: "https://images.pexels.com/photos/1024983/pexels-photo-1024983.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 3, name: "Rol #3", price: "$1,800", image: "https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 4, name: "Rol #4", price: "$2,500", image: "https://images.pexels.com/photos/914929/pexels-photo-914929.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }} style={styles.headerButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Roles</Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Location Section */}
          <TouchableOpacity style={[styles.locationContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <MapPin size={16} color={colors.accent} />
            <Text style={[styles.locationText, { color: colors.text, fontSize: 15 * fontScale }]}>Aguascalientes</Text>
          </TouchableOpacity>

          {/* User Card */}
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Mauricio Rivera</Text>
              <Text style={styles.userRole}>Rol: Padrino de anillos</Text>
            </View>
          </View>

          {/* Tasks Section */}
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>Tareas</Text>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => toggleTask(task.id)}
              >
                <View style={[styles.checkbox, task.completed && styles.checkboxCompleted]} />
                <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Roles Grid */}
          <View style={styles.grid}>
            {roles.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.cardContent}>
                  <Text style={[styles.itemName, { color: colors.text, fontSize: 14 * fontScale }]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, { color: colors.muted, fontSize: 14 * fontScale }]}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.getParent()?.navigate('AddInvitado', {
            onSave: (newRole) => {
              console.log('Nuevo rol:', newRole);
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
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
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
  headerButton: {
    padding: 4,
    width: 32,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  locationText: {
    marginLeft: 6,
    fontWeight: "500",
  },
  userCard: {
    backgroundColor: "#ff6b6b",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  tasksSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#FFB3B3",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#ff6b6b",
  },
  taskText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  taskTextCompleted: {
    color: "#999",
    textDecorationLine: "line-through",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  cardContent: {
    padding: 12,
  },
  itemName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: "500",
  },
});
