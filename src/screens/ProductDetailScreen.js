import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { getUserData } from '../services/authService';
import * as budgetService from '../services/budgetService';
import { ArrowLeft, Heart, Share2, MapPin, Phone, Mail, Star } from "lucide-react-native";

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product, category } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
      isFavorite 
        ? "Se quitó de tu lista de favoritos" 
        : "Se agregó a tu lista de favoritos"
    );
  };

  const handleShare = async () => {
    Alert.alert(
      "Compartir",
      `¿Quieres compartir ${product.name} con tu pareja?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Compartir", onPress: () => Alert.alert("¡Compartido!", "Se compartió con tu pareja") }
      ]
    );
  };

  const handleContact = () => {
    Alert.alert(
      "Contactar proveedor",
      "¿Cómo deseas contactar al proveedor?",
      [
        { text: "Llamar", onPress: () => Alert.alert("Llamando...") },
        { text: "WhatsApp", onPress: () => Alert.alert("Abriendo WhatsApp...") },
        { text: "Correo", onPress: () => Alert.alert("Abriendo correo...") },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const handleReserve = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Build item to store in Costos (presupuestos/items)
      const getRandomArrival = () => {
        const daysAhead = Math.floor(Math.random() * 14) + 1; // 1..14 days
        const d = new Date();
        d.setDate(d.getDate() + daysAhead);
        const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        return `Llegará el ${d.getDate()} de ${months[d.getMonth()]}`;
      };

      const arrival = getRandomArrival();
      const item = {
        name: product.name || 'Producto',
        detail: product.description || product.shortDescription || '',
        price: product.price || '$0.00',
        provider: product.provider || 'Proveedor',
        status: `Reservado - ${arrival}`,
        arrivalAt: new Date(Date.now() + (Math.floor(Math.random()*14)+1) * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Get current auth state once
      const user = await new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (u) => {
          unsub && unsub();
          resolve(u);
        });
        // fallback timeout in case onAuthStateChanged doesn't fire (unlikely)
        setTimeout(() => resolve(auth.currentUser || null), 1000);
      });

      if (!user) {
        Alert.alert('Inicia sesión', 'Debes iniciar sesión para guardar la reservación en tu cuenta. Se añadirá localmente y podrás guardarlo después.');
        // Navigate to Costos carrito anyway (local add will not persist)
        navigation.navigate('Costos', { tab: 'carrito' });
        setIsSaving(false);
        return;
      }

      // Check if user belongs to a shared account
      const ud = await getUserData(user.uid);
      const shared = ud && ud.data && ud.data.sharedAccountCode ? ud.data.sharedAccountCode : null;

      if (shared) {
        await budgetService.addItemToAccount(shared, item);
      } else {
        await budgetService.addItem(user.uid, item);
      }

      // Navigate to Costos and open carrito tab
      navigation.navigate('Costos', { tab: 'carrito' });
    } catch (err) {
      console.error('Error reservando producto:', err);
      Alert.alert('Error', 'No se pudo reservar el producto. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <TouchableOpacity onPress={handleFavorite} style={styles.headerButton}>
          <Heart size={24} color={isFavorite ? "#ff6b6b" : "#333"} fill={isFavorite ? "#ff6b6b" : "none"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Imagen del producto */}
        <Image source={{ uri: product.image }} style={styles.mainImage} />

        {/* Información principal */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <Share2 size={20} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.productPrice}>{product.price}</Text>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={16} color="#FFD700" fill="#FFD700" />
            ))}
            <Text style={styles.ratingText}>5.0 (128 reseñas)</Text>
          </View>

          {/* Proveedor */}
          <View style={styles.providerSection}>
            <Text style={styles.sectionTitle}>Proveedor</Text>
            <View style={styles.providerInfo}>
              <View style={styles.providerAvatar}>
                <Text style={styles.providerAvatarText}>{product.name.charAt(0)}</Text>
              </View>
              <View style={styles.providerDetails}>
                <Text style={styles.providerName}>Nombre del Proveedor</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.locationText}>Aguascalientes, México</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>
              Este producto de alta calidad está diseñado especialmente para tu día especial. 
              Cuenta con materiales premium y acabados elegantes que complementarán perfectamente 
              tu ceremonia. Disponible en diferentes estilos y colores para adaptarse a tus 
              necesidades específicas.
            </Text>
          </View>

          {/* Características */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>Material de alta calidad</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>Disponible en varios colores</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>Personalizable según tus necesidades</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.featureText}>Entrega a domicilio disponible</Text>
            </View>
          </View>

          {/* Información de contacto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de contacto</Text>
            <View style={styles.contactRow}>
              <Phone size={18} color="#ff6b6b" />
              <Text style={styles.contactText}>449 123 4567</Text>
            </View>
            <View style={styles.contactRow}>
              <Mail size={18} color="#ff6b6b" />
              <Text style={styles.contactText}>proveedor@ejemplo.com</Text>
            </View>
            <View style={styles.contactRow}>
              <MapPin size={18} color="#ff6b6b" />
              <Text style={styles.contactText}>Av. Principal #123, Aguascalientes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Phone size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Contactar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.reserveButton, isSaving && { opacity: 0.7 }]}
          onPress={handleReserve}
          disabled={isSaving}
        >
          <Text style={styles.reserveButtonText}>{isSaving ? 'Reservando...' : 'Reservar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    flex: 1,
  },
  mainImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#f5f5f5',
  },
  mainInfo: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  shareButton: {
    padding: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  providerSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: '#ff6b6b',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
    marginLeft: 8,
  },
  reserveButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
