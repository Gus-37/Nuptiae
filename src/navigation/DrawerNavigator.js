import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AgendaScreen from '../screens/AgendaScreen';
import AddTareaScreen from '../screens/AddTareaScreen';
import AddItinerarioScreen from '../screens/AddItinerarioScreen';
import ProfileStack from './ProfileStack';
import InvitadosScreen from '../screens/InvitadosScreen';
import AddInvitadoScreen from '../screens/AddInvitadoScreen';
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Componente interno para pantallas temporales
function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {route.name} (en construcción)
      </Text>
    </View>
  );
}

// Bottom Tabs
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: '', // elimina el título
        tabBarShowLabel: false,
        tabBarStyle: { height: 70 },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Agenda') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Presupuesto') iconName = focused ? 'cash' : 'cash-outline';
          else if (route.name === 'Profile') iconName = focused ? 'people' : 'people-outline';

          return <Ionicons name={iconName} size={28} color={focused ? '#e57373' : '#757575'} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={PlaceholderScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Presupuesto" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// Drawer principal
export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#8e0909b5' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#680b0bff',
        drawerLabelStyle: { fontSize: 16, fontWeight: '500' },
      }}
    >
      <Drawer.Screen 
        name="Principal" 
        component={BottomTabs} 
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="AddTarea" 
        component={AddTareaScreen} 
        options={{
          drawerItemStyle: { height: 0 },
          title: '',
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="AddInvitado" 
        component={AddInvitadoScreen} 
        options={{
          drawerItemStyle: { height: 0 },
          title: '',
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="AddItinerario" 
        component={AddItinerarioScreen} 
        options={{
          drawerItemStyle: { height: 0 },
          title: '',
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Invitados" 
        component={InvitadosScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Promos" 
        component={PlaceholderScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="star-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Proveedores" 
        component={PlaceholderScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="business-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Comunidad" 
        component={PlaceholderScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="people-circle-outline" size={24} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Ayuda" 
        component={PlaceholderScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="help-circle-outline" size={24} color={color} />
          ),
        }} 
      />
    </Drawer.Navigator>
  );
}