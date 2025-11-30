import { addProduct } from './productsService';

/**
 * Ejemplo de cómo agregar productos desde cualquier parte del código
 * Puedes copiar y pegar estos ejemplos en un botón o pantalla
 */

// ========================================
// VESTIDOS
// ========================================
export const agregarVestidoEjemplo = async () => {
  await addProduct('vestidos', {
    name: "Vestido Princesa Rosa",
    price: "$4,200",
    image: "https://images.pexels.com/photos/1779108/pexels-photo-1779108.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Hermoso vestido estilo princesa con detalles en rosa y encaje fino",
    provider: "Boutique Elegance",
    rating: 5,
    location: "Aguascalientes"
  });
  console.log('✅ Vestido agregado');
};

// ========================================
// FLORISTERÍAS
// ========================================
export const agregarFloresEjemplo = async () => {
  await addProduct('floristerias', {
    name: "Centro de Mesa Premium",
    price: "$800",
    image: "https://images.pexels.com/photos/1179863/pexels-photo-1179863.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Centro de mesa con rosas blancas y eucalipto",
    provider: "Flores del Valle",
    rating: 5,
    location: "Aguascalientes"
  });
  console.log('✅ Arreglo floral agregado');
};

// ========================================
// TRAJES
// ========================================
export const agregarTrajeEjemplo = async () => {
  await addProduct('trajes', {
    name: "Smoking Negro Elegante",
    price: "$3,800",
    image: "https://images.pexels.com/photos/2788488/pexels-photo-2788488.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Smoking negro de corte italiano con detalles en satín",
    provider: "Sastrería Real",
    rating: 5,
    location: "Aguascalientes"
  });
  console.log('✅ Traje agregado');
};

// ========================================
// ACCESORIOS
// ========================================
export const agregarAccesorioEjemplo = async () => {
  await addProduct('accesorios', {
    name: "Corona de Flores",
    price: "$450",
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Corona delicada de flores naturales para la novia",
    provider: "Accesorios Nupciales",
    rating: 5,
    location: "Aguascalientes"
  });
  console.log('✅ Accesorio agregado');
};

// ========================================
// FOTOGRAFÍA Y VIDEO
// ========================================
export const agregarFotografiaEjemplo = async () => {
  await addProduct('fotografia', {
    name: "Paquete Premium Foto + Video",
    price: "$7,500",
    image: "https://images.pexels.com/photos/606800/pexels-photo-606800.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Paquete completo: 8 horas de cobertura, álbum premium y video cinematográfico",
    provider: "Estudio Visual",
    rating: 5,
    location: "Aguascalientes"
  });
  console.log('✅ Paquete de fotografía agregado');
};

// ========================================
// AGREGAR MÚLTIPLES PRODUCTOS A LA VEZ
// ========================================
export const agregarVariosProductos = async () => {
  const productos = [
    // Vestidos
    {
      categoria: 'vestidos',
      data: {
        name: "Vestido Bohemio",
        price: "$3,800",
        image: "https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Vestido bohemio con encaje y mangas largas",
        provider: "Boho Chic",
        rating: 5,
        location: "Aguascalientes"
      }
    },
    {
      categoria: 'vestidos',
      data: {
        name: "Vestido Minimalista",
        price: "$2,900",
        image: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Diseño minimalista y elegante de corte recto",
        provider: "Minimal Bride",
        rating: 5,
        location: "Aguascalientes"
      }
    },
    // Flores
    {
      categoria: 'floristerias',
      data: {
        name: "Ramo Cascada",
        price: "$1,200",
        image: "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Ramo estilo cascada con orquídeas blancas",
        provider: "Flores Elegantes",
        rating: 5,
        location: "Aguascalientes"
      }
    },
    // Trajes
    {
      categoria: 'trajes',
      data: {
        name: "Traje Azul Marino",
        price: "$3,200",
        image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Traje azul marino de 3 piezas con chaleco",
        provider: "Gentleman Style",
        rating: 5,
        location: "Aguascalientes"
      }
    },
    // Accesorios
    {
      categoria: 'accesorios',
      data: {
        name: "Set de Aretes y Collar",
        price: "$890",
        image: "https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Set de perlas naturales con acabado en plata",
        provider: "Joyería Luna",
        rating: 5,
        location: "Aguascalientes"
      }
    }
  ];

  try {
    for (const producto of productos) {
      await addProduct(producto.categoria, producto.data);
      console.log(`✅ ${producto.data.name} agregado`);
    }
    console.log('🎉 Todos los productos agregados exitosamente');
  } catch (error) {
    console.error('❌ Error al agregar productos:', error);
  }
};

// ========================================
// AGREGAR CON TU PROPIA IMAGEN
// ========================================
export const agregarProductoPersonalizado = async (categoria, datosProducto) => {
  /**
   * Uso:
   * 
   * await agregarProductoPersonalizado('vestidos', {
   *   name: "Mi Vestido",
   *   price: "$5,000",
   *   image: "URL_DE_TU_IMAGEN",
   *   description: "Descripción",
   *   provider: "Proveedor",
   *   rating: 5,
   *   location: "Aguascalientes"
   * });
   */
  
  try {
    await addProduct(categoria, datosProducto);
    console.log(`✅ ${datosProducto.name} agregado a ${categoria}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, error };
  }
};

// ========================================
// EJEMPLO DE USO EN UN BOTÓN
// ========================================
/*

import { agregarVestidoEjemplo, agregarVariosProductos } from './ejemplosProductos';

// En tu componente:
<TouchableOpacity onPress={agregarVestidoEjemplo}>
  <Text>Agregar Vestido de Ejemplo</Text>
</TouchableOpacity>

<TouchableOpacity onPress={agregarVariosProductos}>
  <Text>Agregar Varios Productos</Text>
</TouchableOpacity>

// O para agregar uno personalizado:
<TouchableOpacity onPress={async () => {
  await agregarProductoPersonalizado('vestidos', {
    name: "Vestido Vintage",
    price: "$4,500",
    image: "https://mi-imagen.com/vestido.jpg",
    description: "Vestido estilo vintage años 50",
    provider: "Vintage Bride",
    rating: 5,
    location: "Aguascalientes"
  });
}}>
  <Text>Agregar Mi Producto</Text>
</TouchableOpacity>

*/
