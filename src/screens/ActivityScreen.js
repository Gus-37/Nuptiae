import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { useUISettings } from '../context/UISettingsContext';

export default function ActivityScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();

  const data = [
    { id: '1', text: 'Actualizaste tu perfil', time: 'Hace 2h' },
    { id: '2', text: 'Agregaste un invitado', time: 'Ayer' },
    { id: '3', text: 'Creaste una tarea', time: 'Hace 3 días' },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.itemLeft}>
        <Clock size={18} color={colors.muted} />
        <Text style={[styles.itemText, { color: colors.text, fontSize: 15 * fontScale }]}>{item.text}</Text>
      </View>
      <Text style={[styles.itemTime, { color: colors.muted, fontSize: 12 * fontScale }]}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top','left','right']}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Actividad Reciente</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemText: { fontWeight: '600' },
  itemTime: { fontWeight: '500' },
});