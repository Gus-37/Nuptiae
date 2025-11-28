import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseAgendas } from '../config/firebaseAgendas';
import { ref, onValue } from 'firebase/database';

export default function PreparativosScreen({ hideHeader = false }) {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [preparativos, setPreparativos] = useState([]);

  // Cargar preparativos desde Firebase
  React.useEffect(() => {
    const preparativosRef = ref(databaseAgendas, 'agenda/preparativos');
    const unsub = onValue(preparativosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setPreparativos(items);
      } else {
        // si no hay datos, podemos usar defaults locales
        setPreparativos([
          {
            id: 1,
            category: 'Establecer el presupuesto',
            description: 'Definir cuánto pueden gastar para tener una idea de las opciones.',
            color: '#f08080',
            expanded: true,
          },
          {
            id: 2,
            category: 'Crear la lista de invitados',
            description: 'Decidir a quién invitar antes de buscar el lugar de la celebración.',
            color: '#f08080',
            expanded: false,
          },
          {
            id: 3,
            category: 'Contratar proveedores clave',
            description: 'Reservar a tiempo el catering, el fotógrafo, el videógrafo y el DJ o la banda.',
            color: '#ff6b6b',
            expanded: false,
          },
          {
            id: 4,
            category: 'Elegir fecha y lugar',
            description: 'Buscar un espacio para la ceremonia y la recepción que se ajuste a su estilo y presupuesto.',
            color: '#ff6b6b',
            expanded: false,
          },
        ]);
      }
    });

    return () => unsub();
  }, []);

  const toggleCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const renderPreparativoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.preparativoItem}
      onPress={() => toggleCategory(item.id)}
    >
      <View style={styles.itemHeader}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <View style={styles.titleContainer}>
          <Text style={styles.categoryTitle}>{item.category}</Text>
        </View>
        <Ionicons
          name={expandedCategory === item.id ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </View>

      {expandedCategory === item.id && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      {!hideHeader && (
        <View style={styles.header}>
          <Text style={styles.headerText}>Preparativos</Text>
          <Text style={styles.subtitle}>Cosas a considerar para tu boda</Text>
        </View>
      )}

      {/* Lista de preparativos */}
      <FlatList
        data={preparativos}
        renderItem={renderPreparativoItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  preparativoItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  descriptionContainer: {
    paddingHorizontal: 15,
    paddingBottom: 14,
    backgroundColor: '#fdfdfd',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
