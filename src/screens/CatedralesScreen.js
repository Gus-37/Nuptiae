import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { ref, onValue } from 'firebase/database';
import { providersDatabase as database } from '../config/firebaseConfig';
import { useUISettings } from '../context/UISettingsContext';

export default function CatedralesScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'products/catedrales';
    const proveedoresRef = ref(database, path);
    const unsub = onValue(proveedoresRef, (snapshot) => {
      const data = snapshot.val();
      console.log('[CatedralesScreen] Firebase path:', path);
      console.log('[CatedralesScreen] Data:', data);
      if (data) {
        const items = Object.keys(data).map((key) => ({ ...data[key], id: key }));
        setProveedores(items);
      } else {
        setProveedores([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('[CatedralesScreen] Error leyendo datos:', error);
      setProveedores([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Catedrales</Text>
          <View style={styles.headerButton} />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.helper, { color: colors.muted, fontSize: 14 * fontScale }]}>Cargando catedrales...</Text>
          </View>
        ) : proveedores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.helper, { color: colors.muted, fontSize: 14 * fontScale }]}>No hay catedrales registradas. Verifica Firebase en products/catedrales.</Text>
          </View>
        ) : (
          <FlatList
            data={proveedores}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() => navigation.navigate('DetalleProveedor', { proveedor: item })}
              >
                {item.imagen && <Image source={{ uri: item.imagen }} style={[styles.image, { backgroundColor: theme === 'light' ? '#f0f0f0' : colors.bg }]} />}
                <View style={styles.cardContent}>
                  <Text style={[styles.name, { color: colors.text, fontSize: 14 * fontScale }]}>{item.nombre}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerButton: { padding: 4, width: 32 },
  listContent: { padding: 12 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 12 },
  name: { fontSize: 14, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  helper: { fontSize: 14, textAlign: 'center' },
});
