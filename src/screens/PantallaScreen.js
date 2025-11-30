import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Sun, Moon } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";
import { useLanguage } from "../context/LanguageContext";

export default function PantallaScreen({ navigation }) {
  const { theme, setTheme, textSize, setTextSize, fontScale, colors } = useUISettings();
  const { t } = useLanguage();

  const darkMode = theme === "dark";
  const textSizes = [
    { id: "normal", label: t("normal"), base: 16 },
    { id: "large", label: t("large"), base: 18 },
    { id: "extra", label: t("extraLarge"), base: 21 },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top","left","right"]}>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.bg}
      />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>
            {t("display")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ padding: 20 }}>

          {/* Modo oscuro */}
          <View style={styles.section}>
            <View style={[styles.optionRow, { backgroundColor: colors.card }]}>
              <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? "#1E1E1E" : "#f5f5f5" }]}>
                  {darkMode ? <Moon size={20} color={colors.muted} /> : <Sun size={20} color={colors.muted} />}
                </View>
                <Text style={[styles.optionText, { color: colors.text, fontSize: 16 * fontScale }]}>
                  {t("darkMode")}
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={(v) => setTheme(v ? "dark" : "light")}
                trackColor={{ false: "#e0e0e0", true: colors.accent }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Tamaño de texto */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * fontScale }]}>
              {t("textSize")}
            </Text>
            {textSizes.map(ts => {
              const active = textSize === ts.id;
              return (
                <TouchableOpacity
                  key={ts.id}
                  style={[
                    styles.sizeRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: active ? colors.accent : "transparent",
                      borderWidth: active ? 2 : 0
                    }
                  ]}
                  onPress={() => setTextSize(ts.id)}
                >
                  <Text
                    style={{
                      color: active ? colors.accent : colors.text,
                      fontSize: ts.base * fontScale,
                      fontWeight: active ? "600" : "500"
                    }}
                  >
                    {ts.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>
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
  headerTitle: { fontWeight: "600" },
  content: { flex: 1 },
  section: { marginBottom: 28 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    marginRight: 12
  },
  optionText: { fontWeight: "500" },
  sectionTitle: { fontWeight: "600", marginBottom: 12 },
  sizeRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12
  }
});
