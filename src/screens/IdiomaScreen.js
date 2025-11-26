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
import { CommonActions } from '@react-navigation/native';

export default function IdiomaScreen({ navigation, route }) {
  const [selectedLanguage, setSelectedLanguage] = useState("Español");
  const params = route.params || {};

  const languages = [
    { id: 1, name: "Español" },
    { id: 2, name: "Inglés" },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            navigation.getParent()?.navigate('ProfileDetail', params);
          }}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Idioma</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.name && styles.languageOptionSelected,
                ]}
                onPress={() => setSelectedLanguage(language.name)}
              >
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === language.name && styles.languageTextSelected,
                  ]}
                >
                  {language.name}
                </Text>
                {selectedLanguage === language.name && (
                  <Check size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 12,
  },
  languageOptionSelected: {
    backgroundColor: "#ff6b6b",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  languageTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
