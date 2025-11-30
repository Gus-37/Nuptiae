import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useUISettings } from '../context/UISettingsContext';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationsScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top','left','right']}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Notificaciones</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.left}>
              <Bell size={20} color={colors.muted} />
              <Text style={[styles.label, { color: colors.text, fontSize: 16 * fontScale }]}>Push</Text>
            </View>
            <Switch value={enabled} onValueChange={setEnabled} />
          </View>

          <View style={[styles.row, { marginTop: 12 }]}>
            <Text style={[styles.label, { color: colors.text, fontSize: 16 * fontScale }]}>Correo</Text>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontWeight: '600' },
  content: { padding: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontWeight: '600' },
});
