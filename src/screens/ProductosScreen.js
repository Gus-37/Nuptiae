import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function ProductosScreen({ route, navigation }) {
  const { proveedor, productos } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos de {proveedor}</Text>
      {productos.length === 0 ? (
        <Text style={styles.emptyText}>No hay productos disponibles</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('DetalleProducto', { producto: item })}
            >
              {item.imagen && (
                <Image source={{ uri: item.imagen }} style={styles.productImage} />
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                {item.precio && (
                  <Text style={styles.productPrice}>${item.precio}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#222' },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
  productCard: { 
    backgroundColor: '#F5F6FA', 
    borderRadius: 12, 
    marginBottom: 12, 
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: { width: 100, height: 100 },
  productInfo: { flex: 1, padding: 12 },
  productName: { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 4 },
  productPrice: { fontSize: 14, color: '#ff6b6b', fontWeight: '600' },
});
