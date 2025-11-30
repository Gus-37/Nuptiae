import { providersDatabase } from '../config/firebaseConfig';
import { ref, set, get, push, update, remove, onValue } from 'firebase/database';

/**
 * Obtener todos los productos de una categoría
 */
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = ref(providersDatabase, `products/${category}`);
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      // Convertir objeto a array con IDs
      return Object.keys(productsData).map(key => ({
        id: key,
        ...productsData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Escuchar cambios en tiempo real de una categoría
 */
export const listenToProducts = (category, callback) => {
  const productsRef = ref(providersDatabase, `products/${category}`);
  
  const unsubscribe = onValue(productsRef, (snapshot) => {
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      const products = Object.keys(productsData).map(key => ({
        id: key,
        ...productsData[key]
      }));
      callback(products);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error al escuchar productos:', error);
    callback([]);
  });

  return unsubscribe;
};

/**
 * Agregar un nuevo producto
 */
export const addProduct = async (category, productData) => {
  try {
    const productsRef = ref(providersDatabase, `products/${category}`);
    const newProductRef = push(productsRef);
    await set(newProductRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return newProductRef.key;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
};

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (category, productId, productData) => {
  try {
    const productRef = ref(providersDatabase, `products/${category}/${productId}`);
    await update(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Eliminar un producto
 */
export const deleteProduct = async (category, productId) => {
  try {
    const productRef = ref(providersDatabase, `products/${category}/${productId}`);
    await remove(productRef);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

/**
 * Obtener un producto específico
 */
export const getProductById = async (category, productId) => {
  try {
    const productRef = ref(providersDatabase, `products/${category}/${productId}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      return {
        id: productId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

/**
 * Inicializar productos de ejemplo (ejecutar una sola vez)
 */
export const initializeSampleProducts = async () => {
  try {
    const categories = {
      vestidos: [
        {
          name: "Vestido Elegante",
          price: "$3,000",
          image: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Hermoso vestido de novia con detalles elegantes",
          provider: "Boutique Elegance",
          rating: 5,
          location: "Aguascalientes"
        },
        {
          name: "Vestido Romántico",
          price: "$4,000",
          image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Vestido romántico perfecto para tu día especial",
          provider: "Romance Nupcial",
          rating: 5,
          location: "Aguascalientes"
        }
      ],
      floristerias: [
        {
          name: "Ramo de Novia",
          price: "$1,000",
          image: "https://images.pexels.com/photos/1070861/pexels-photo-1070861.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Hermoso ramo de flores frescas para la novia",
          provider: "Flores del Campo",
          rating: 5,
          location: "Aguascalientes"
        }
      ],
      trajes: [
        {
          name: "Traje Ejecutivo",
          price: "$3,000",
          image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Traje ejecutivo de alta calidad",
          provider: "Sastrería Premium",
          rating: 5,
          location: "Aguascalientes"
        }
      ],
      accesorios: [
        {
          name: "Anillos de Boda",
          price: "$3,000",
          image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Elegantes anillos de boda en oro blanco",
          provider: "Joyería Diamante",
          rating: 5,
          location: "Aguascalientes"
        }
      ],
      fotografia: [
        {
          name: "Paquete Básico Foto",
          price: "$2,000",
          image: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Paquete básico de fotografía para tu boda",
          provider: "Foto Memorias",
          rating: 5,
          location: "Aguascalientes"
        },
        {
          name: "Video Cinematográfico",
          price: "$3,500",
          image: "https://images.pexels.com/photos/2608516/pexels-photo-2608516.jpeg?auto=compress&cs=tinysrgb&w=800",
          description: "Video profesional estilo cinematográfico",
          provider: "Cinematic Dreams",
          rating: 5,
          location: "Aguascalientes"
        }
      ]
    };

    const promises = [];
    for (const [category, products] of Object.entries(categories)) {
      products.forEach(product => {
        promises.push(addProduct(category, product));
      });
    }

    await Promise.all(promises);
    console.log('Productos de ejemplo creados exitosamente');
  } catch (error) {
    console.error('Error al inicializar productos:', error);
    throw error;
  }
};
