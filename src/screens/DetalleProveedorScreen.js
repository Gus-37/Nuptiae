import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, ArrowLeft } from 'lucide-react-native';

export default function DetalleProveedorScreen({ route, navigation }) {
  const { proveedor } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView style={styles.container}>
      {proveedor.imagen && (
        <Image source={{ uri: proveedor.imagen }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{proveedor.nombre}</Text>
        
        {proveedor.ubicacion && (
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#666" />
            <Text style={styles.locationText}>{proveedor.ubicacion}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.descripcion}>
          {proveedor.descripcion || 'No hay descripción disponible para este proveedor.'}
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
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
  backButton: { padding: 4, width: 32 },
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#222' },
  locationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    gap: 6,
  },
  locationText: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 8 },
  descripcion: { fontSize: 16, color: '#666', lineHeight: 24 },
});
