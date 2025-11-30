import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";
import { useLanguage } from "../context/LanguageContext";

export default function IdiomaScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const { language, changeLanguage, t } = useLanguage();

  const languages = [
    { id: 1, name: t("spanish"), code: "es" },
    { id: 2, name: t("english"), code: "en" },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>
            {t("language")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            {languages.map((lang) => {
              const selected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.languageOption,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    selected && { backgroundColor: colors.accent, borderColor: colors.accent },
                  ]}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      { color: colors.text, fontSize: 16 * fontScale },
                      selected && styles.languageTextSelected,
                    ]}
                  >
                    {lang.name}
                  </Text>
                  {selected && <Check size={20} color="#fff" />}
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
  headerTitle: {
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  languageText: {
    fontWeight: "500",
  },
  languageTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
