import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, ShoppingCart, Calendar, Users } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNavigationBar() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Determine which icon should be active based on current route
  const currentRoute = route.name;
  
  const navItems = [
    {
      name: 'Home',
      icon: Home,
      label: 'Inicio',
      onPress: () => navigation.navigate('Home')
    },
    {
      name: 'Costos',
      icon: ShoppingCart,
      label: 'Costos',
      onPress: () => navigation.navigate('Costos', { tab: 'compras' })
    },
    {
      name: 'Agenda',
      icon: Calendar,
      label: 'Agenda',
      onPress: () => navigation.navigate('Agenda')
    },
    {
      name: 'Cuentas',
      icon: Users,
      label: 'Cuentas',
      onPress: () => navigation.navigate('Cuentas')
    }
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.name;
        
        return (
          <TouchableOpacity 
            key={item.name}
            style={styles.navItem} 
            onPress={item.onPress}
          >
            <Icon 
              size={24} 
              color={isActive ? '#ff6b6b' : '#666'} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
