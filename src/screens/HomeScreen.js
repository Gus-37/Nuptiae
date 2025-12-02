// Formatea fecha tipo YYYY-MM-DD o YYYY/MM/DD o timestamp a dd/mm/yyyy
function formatDate(dateStr) {
  if (!dateStr) return '';
  
  // Si es número (timestamp), convertir a Date
  if (typeof dateStr === 'number') {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Si no es string, intentar convertir
  if (typeof dateStr !== 'string') {
    dateStr = String(dateStr);
  }
  
  let d = dateStr.replace(/\//g, '-');
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, d2] = d.split('-');
    return `${d2}/${m}/${y}`;
  }
  if (/^\d{4}-\d{2}-\d{1,2}$/.test(d)) {
    const [y, m, d2] = d.split('-');
    const day = d2.padStart(2, '0');
    return `${day}/${m}/${y}`;
  }
  if (/^\d{4}\d{2}\d{2}$/.test(d)) {
    return `${d.slice(6,8)}/${d.slice(4,6)}/${d.slice(0,4)}`;
  }
  return d;
}
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Users, ShoppingCart, Calendar, Home } from "lucide-react-native";
import { useUISettings } from '../context/UISettingsContext';
import { auth, database } from "../config/firebaseConfig";
import { getUserData } from "../services/authService";
import { getSharedAccountInfo } from "../services/accountService";
import { ref, update, onValue } from 'firebase/database';
import { databaseAgendas } from '../config/firebaseAgendas';

export default function HomeScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
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

      if (userData.success) {
        // Obtener información de cuenta compartida si existe
        if (userData.data.sharedAccountCode) {
          const accountInfo = await getSharedAccountInfo(userData.data.sharedAccountCode);
          
          if (accountInfo.success && accountInfo.account.members) {
            const members = accountInfo.account.members;
            
            // Actualizar nombre del usuario actual si es necesario
            if (currentUser.displayName) {
              const currentName = userData.data.name;
              const emailPrefix = currentUser.email?.split('@')[0];
              if (!currentName || currentName === emailPrefix) {
                await update(ref(database, `users/${currentUser.uid}`), {
                  name: currentUser.displayName
                });
              }
            }
            
            // Mostrar nombres de la pareja si hay 2 miembros
            if (members.length === 2) {
              const name1 = members[0].name || currentUser.displayName || 'Usuario';
              const name2 = members[1].name || 'Usuario';
              setCoupleNames(`${name1} y ${name2}`);
            } else if (members.length === 1) {
              const name = members[0].name || currentUser.displayName || 'Usuario';
              setCoupleNames(name);
            }
          } else {
            // Tiene código pero no se pudo obtener info de cuenta
            const name = userData.data.name || currentUser.displayName || 'Usuario';
            setCoupleNames(name);
          }
        } else {
          // Usuario sin cuenta compartida
          const name = userData.data.name || currentUser.displayName || 'Usuario';
          setCoupleNames(name);
        }
        
        // Calcular días hasta la boda y progreso
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
    { id: 1, name: "Vestidos", icon: "👗", color: "#FFE5E5" },
    { id: 2, name: "Catedrales", icon: "🏰", color: "#E8E5FF" },
    { id: 3, name: "Fotografía", icon: "📷", color: "#E5F5FF" },
    { id: 4, name: "Playas", icon: "🏖️", color: "#E5FFF5" },
  ];

  // Estado para tareas próximas
  const [tasks, setTasks] = useState([]);

  // Cargar tareas desde Firebase (agenda/tasks)
  useEffect(() => {
    const tasksRef = ref(databaseAgendas, 'agenda/tasks');
    const unsub = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let items = Object.keys(data).map((key) => ({ ...data[key], id: key }));
        // Ordenar por fecha (asumiendo que cada tarea tiene un campo 'dueDate' tipo string YYYY-MM-DD o similar)
        items = items.filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        // Solo las 3 más próximas
        setTasks(items.slice(0, 3));
      } else {
        setTasks([]);
      }
    });
    return () => unsub();
  }, []);

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
                <Text style={[styles.welcomeTitle, { color: colors.text, fontSize: 28 * fontScale }]} numberOfLines={1}>¡Bienvenidos</Text>
                <Text style={[styles.welcomeTitle, { color: colors.text, fontSize: 28 * fontScale }]} numberOfLines={2}>{coupleNames}!</Text>
                <Text style={[styles.countdown, { color: colors.muted, fontSize: 16 * fontScale }]} numberOfLines={1}>{daysUntilWedding} días para tu boda</Text>
              </>
            )}
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#2A2A2A' }]}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: colors.accent }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.text, fontSize: 14 * fontScale }]}>
                {progressPercentage}%
              </Text>
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
                    if (category.id === 1) {
                      navigation.navigate("Vestidos");
                    } else if (category.name === "Catedrales") {
                      navigation.navigate("Catedrales");
                    } else if (category.name === "Fotografía") {
                      navigation.navigate("Fotografia");
                    } else if (category.name === "Playas") {
                      navigation.navigate("Playas");
                    }
                  }}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Próximas Tareas */}
          <View style={styles.tasksSection}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * fontScale }]}>Tareas próximas</Text>
            {tasks.length === 0 ? (
              <Text style={{ color: colors.muted, marginTop: 8, fontSize: 14 * fontScale }}>No hay tareas próximas</Text>
            ) : (
              tasks.map((task, idx) => (
                <View
                  key={task.id || idx}
                  style={[styles.taskCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.taskDot, { backgroundColor: task.urgente ? colors.accent : colors.muted }]} />
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{task.titulo || task.title}</Text>
                    <Text style={[styles.taskSubtitle, { color: colors.muted, fontSize: 14 * fontScale }]}>
                      Fecha límite: {task.dueDate ? formatDate(task.dueDate) : 'Sin fecha'}
                    </Text>
                  </View>
                </View>
              ))
            )}
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
    borderRadius: 16,
    marginBottom: 12,
  },
  taskCardSoftPink: {},
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  taskDotUrgent: {},
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskSubtitle: {
    fontSize: 14,
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

