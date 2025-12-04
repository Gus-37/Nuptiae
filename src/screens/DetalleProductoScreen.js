import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function DetalleProductoScreen({ route }) {
  const { producto } = route.params;

  return (
    <ScrollView style={styles.container}>
      {producto.imagen && (
        <Image source={{ uri: producto.imagen }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{producto.nombre}</Text>
        {producto.precio && (
          <Text style={styles.precio}>${producto.precio}</Text>
        )}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.descripcion}>
          {producto.descripcion || 'No hay descripción disponible para este producto.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#222' },
  precio: { fontSize: 20, color: '#ff6b6b', fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  descripcion: { fontSize: 16, color: '#666', lineHeight: 24 },
});
