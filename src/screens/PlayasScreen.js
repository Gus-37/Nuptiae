import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { ref, onValue } from 'firebase/database';
import { providersDatabase as database } from '../config/firebaseConfig';

export default function PlayasScreen({ navigation }) {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = 'products/playas';
    const proveedoresRef = ref(database, path);
    const unsub = onValue(proveedoresRef, (snapshot) => {
      const data = snapshot.val();
      console.log('[PlayasScreen] Firebase path:', path);
      console.log('[PlayasScreen] Data:', data);
      if (data) {
        const items = Object.keys(data).map((key) => ({ ...data[key], id: key }));
        setProveedores(items);
      } else {
        setProveedores([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('[PlayasScreen] Error leyendo datos:', error);
      setProveedores([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playas</Text>
          <View style={styles.headerButton} />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.helper}>Cargando playas...</Text>
          </View>
        ) : proveedores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.helper}>No hay playas registradas. Verifica Firebase en products/playas.</Text>
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
                style={styles.card}
                onPress={() => navigation.navigate('DetalleProveedor', { proveedor: item })}
              >
                {item.imagen && <Image source={{ uri: item.imagen }} style={styles.image} />}
                <View style={styles.cardContent}>
                  <Text style={styles.name}>{item.nombre}</Text>
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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  headerButton: { padding: 4, width: 32 },
  listContent: { padding: 12 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: '100%', height: 180, resizeMode: 'cover', backgroundColor: '#f0f0f0' },
  cardContent: { padding: 12 },
  name: { fontSize: 14, fontWeight: '600', color: '#333' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  helper: { fontSize: 14, color: '#666', textAlign: 'center' },
});
