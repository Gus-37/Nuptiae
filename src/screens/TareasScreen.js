import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, ChevronRight, CheckCircle2, Circle } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getTareas } from "../services/tareasService";
import { useUISettings } from "../context/UISettingsContext";

export default function TareasScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTareas = async () => {
    setLoading(true);
    const result = await getTareas();
    if (result.success) setTareas(result.data);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTareas();
    }, [])
  );

  const renderTarea = ({ item }) => (
    <TouchableOpacity
      style={[styles.tareaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => navigation.navigate("AddTarea", { tarea: item })}
    >
      <View style={styles.tareaLeft}>
        {item.completed ? (
          <CheckCircle2 size={24} color={colors.accent} />
        ) : (
          <Circle size={24} color={colors.muted} />
        )}
        <View style={styles.tareaTexts}>
          <Text style={[styles.tareaTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{item.title}</Text>
          {item.description && (
            <Text style={[styles.tareaDescription, { color: colors.muted, fontSize: 13 * fontScale }]} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight size={20} color={colors.muted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 24 * fontScale }]}>Tareas</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddTarea")} style={[styles.addButton, { backgroundColor: colors.accent }]}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={tareas}
            renderItem={renderTarea}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.muted, fontSize: 14 * fontScale }]}>
                No hay tareas. Presiona + para agregar una.
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontWeight: "700" },
  addButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  listContent: { padding: 16 },
  tareaCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  tareaLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  tareaTexts: { marginLeft: 12, flex: 1 },
  tareaTitle: { fontWeight: "600" },
  tareaDescription: { marginTop: 2 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 40 },
});
