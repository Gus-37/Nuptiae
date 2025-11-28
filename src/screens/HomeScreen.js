import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Users, ShoppingCart, Calendar, Home } from "lucide-react-native";
import { auth, database } from "../config/firebaseConfig";
import { getUserData } from "../services/authService";
import { getSharedAccountInfo } from "../services/accountService";
import { ref, update } from 'firebase/database';
import { useUISettings } from "../context/UISettingsContext";

export default function HomeScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const [loading, setLoading] = useState(true);
  const [coupleNames, setCoupleNames] = useState("Jessica y Michael");
  const [daysUntilWedding, setDaysUntilWedding] = useState(90);
  const [weddingDate, setWeddingDate] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(70);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userData = await getUserData(currentUser.uid);
      
      if (currentUser.displayName && userData.success) {
        const currentName = userData.data.name;
        const emailPrefix = currentUser.email?.split('@')[0];
        
        if (!currentName || currentName === emailPrefix) {
          console.log('Actualizando nombre en Firebase:', currentUser.displayName);
          await update(ref(database, `users/${currentUser.uid}`), {
            name: currentUser.displayName
          });
          userData.data.name = currentUser.displayName;
        }
      }
      
      if (userData.success && userData.data.sharedAccountCode) {
        const accountInfo = await getSharedAccountInfo(userData.data.sharedAccountCode);
        
        if (accountInfo.success && accountInfo.account.members) {
          const members = accountInfo.account.members;
          
          if (members.length === 2) {
            let name1 = members[0].uid === currentUser.uid 
              ? (userData.data.name || currentUser.displayName || members[0].name)
              : members[0].name;
            let name2 = members[1].uid === currentUser.uid 
              ? (userData.data.name || currentUser.displayName || members[1].name)
              : members[1].name;
            
            setCoupleNames(`${name1} y ${name2}`);
          } else if (members.length === 1) {
            let name = members[0].uid === currentUser.uid
              ? (userData.data.name || currentUser.displayName || members[0].name)
              : members[0].name;
            setCoupleNames(name);
          }
          
          if (userData.data.weddingDate) {
            const wedding = new Date(userData.data.weddingDate);
            setWeddingDate(wedding);
            const today = new Date();
            const diffTime = wedding - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntilWedding(diffDays > 0 ? diffDays : 0);
            
            if (userData.data.createdAt) {
              const startDate = new Date(userData.data.createdAt);
              const totalDays = Math.ceil((wedding - startDate) / (1000 * 60 * 60 * 24));
              const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
              const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
              setProgressPercentage(Math.round(progress));
            }
          }
        }
      } else if (userData.success) {
        const name = userData.data.name || currentUser.displayName || 'Usuario';
        setCoupleNames(name);
        
        if (userData.data.weddingDate) {
          const wedding = new Date(userData.data.weddingDate);
          setWeddingDate(wedding);
          const today = new Date();
          const diffTime = wedding - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysUntilWedding(diffDays > 0 ? diffDays : 0);
          
          if (userData.data.createdAt) {
            const startDate = new Date(userData.data.createdAt);
            const totalDays = Math.ceil((wedding - startDate) / (1000 * 60 * 60 * 24));
            const daysElapsed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
            const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
            setProgressPercentage(Math.round(progress));
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 1, name: "Vestidos", icon: "👗", color: theme === 'light' ? "#FFE5E5" : "#4A2828" },
    { id: 2, name: "Iglesias", icon: "⛪", color: theme === 'light' ? "#FFE5F5" : "#4A284A" },
    { id: 3, name: "Comida", icon: "🍽️", color: theme === 'light' ? "#FFF5E5" : "#4A3E28" },
    { id: 4, name: "Zapatos", icon: "👠", color: theme === 'light' ? "#E5F5E5" : "#284A28" },
  ];

  const tasks = [
    {
      id: 1,
      title: "Asignar maestro de ceremonias",
      subtitle: "Fecha límite: 2035jun25",
      color: theme === 'light' ? "#FFE5E5" : "#4A2828",
    },
    {
      id: 2,
      title: "Lista de canciones nupciales",
      subtitle: "Fecha límite: 3000/5/28",
      color: theme === 'light' ? "#FFE5E5" : "#4A2828",
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Menu size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.logoText, { color: colors.accent, fontSize: 20 * fontScale }]}>Nuptiae</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.accent} style={{ marginVertical: 20 }} />
            ) : (
              <>
                <Text style={[styles.welcomeTitle, { color: colors.text, fontSize: 24 * fontScale }]}>¡Bienvenidos</Text>
                <Text style={[styles.welcomeTitle, { color: colors.text, fontSize: 24 * fontScale }]}>{coupleNames}!</Text>
                <Text style={[styles.countdown, { color: colors.muted, fontSize: 14 * fontScale }]}>{daysUntilWedding} días para tu boda</Text>
              </>
            )}
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#2A2A2A' }]}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: colors.accent }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.text, fontSize: 14 * fontScale }]}>{progressPercentage}%</Text>
            </View>

            <Text style={[styles.exploreText, { color: colors.muted, fontSize: 14 * fontScale }]}>
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
                  <Text style={[styles.categoryName, { color: colors.text, fontSize: 14 * fontScale }]}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Próximas Tareas */}
          <View style={styles.tasksSection}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Tareas próximas</Text>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskCard, { backgroundColor: task.color }]}
              >
                <View style={[styles.taskDot, { backgroundColor: colors.accent }]} />
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: colors.text, fontSize: 15 * fontScale }]}>{task.title}</Text>
                  <Text style={[styles.taskSubtitle, { color: colors.muted, fontSize: 13 * fontScale }]}>{task.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.navItem}>
            <Home size={24} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Costos", { tab: "compras" })}
          >
            <ShoppingCart size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Agenda")}
          >
            <Calendar size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Cuentas")}
          >
            <Users size={24} color={colors.muted} />
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
  logoText: {
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
  },
  welcomeTitle: {
    fontWeight: "700",
    lineHeight: 32,
  },
  countdown: {
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
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontWeight: "600",
  },
  exploreText: {
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
    fontWeight: "600",
  },
  tasksSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: "700",
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
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  taskSubtitle: {
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
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
});

