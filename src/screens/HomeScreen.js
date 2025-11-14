import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Users, ShoppingCart, Calendar, Home } from "lucide-react-native";

export default function HomeScreen({ navigation }) {
  const categories = [
    { id: 1, name: "Vestidos", icon: "👗", color: "#FFE5E5" },
    { id: 2, name: "Iglesias", icon: "⛪", color: "#FFE5F5" },
    { id: 3, name: "Comida", icon: "🍽️", color: "#FFF5E5" },
    { id: 4, name: "Zapatos", icon: "👠", color: "#E5F5E5" },
  ];

  const tasks = [
    {
      id: 1,
      title: "Asignar maestro de ceremonias",
      subtitle: "Fecha límite: 2035jun25",
      color: "#FFE5E5",
    },
    {
      id: 2,
      title: "Lista de canciones nupciales",
      subtitle: "Fecha límite: 3000/5/28",
      color: "#FFE5E5",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Menu size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.logoText}>Nuptiae</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>¡Bienvenidos</Text>
            <Text style={styles.welcomeTitle}>Jessica y Michael!</Text>
            <Text style={styles.countdown}>90 días para tu boda</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "70%" }]} />
              </View>
              <Text style={styles.progressText}>70%</Text>
            </View>

            <Text style={styles.exploreText}>
              Explora el catálogo para tu gran día
            </Text>
          </View>

          {/* Categories */}
          <View style={styles.categoriesSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, { backgroundColor: category.color }]}
                  onPress={() => {
                    if (category.name === "Vestidos") {
                      navigation.navigate("Vestidos");
                    }
                  }}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Próximas Tareas */}
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>Tareas próximas</Text>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskCard, { backgroundColor: task.color }]}
              >
                <View style={styles.taskDot} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskSubtitle}>{task.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Home size={24} color="#ff6b6b" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Costos", { tab: "compras" })}
          >
            <ShoppingCart size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Agenda")}
          >
            <Calendar size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Cuentas")}
          >
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
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff6b6b",
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    lineHeight: 32,
  },
  countdown: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff6b6b",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  exploreText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  categoriesSection: {
    marginVertical: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
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
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
});

