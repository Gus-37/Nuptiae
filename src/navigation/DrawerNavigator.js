import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Users, Gift, Building, HelpCircle, Home } from "lucide-react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FormsScreen from "../screens/FormsScreen";
import ProvidersScreen from "../screens/ProvidersScreen";
import PromocionesScreen from "../screens/PromocionesScreen";
import InvitadosScreen from "../screens/InvitadosScreen";
import AgendaScreen from "../screens/AgendaScreen";
import CostosScreen from "../screens/CostosScreen";
import CuentasScreen from "../screens/CuentasScreen";
import PantallaScreen from "../screens/PantallaScreen";
import IdiomaScreen from "../screens/IdiomaScreen";
import RolesScreen from "../screens/RolesScreen";
import TareasStack from "../navigation/TareasStack";
import PreparativosScreen from "../screens/PreparativosScreen";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.menuIconContainer}>
          <Text style={styles.menuIcon}>☰</Text>
        </View>
        <Text style={styles.logoText}>Nuptiae</Text>
      </View>

      {/* Menu Items */}
      <DrawerItem
        label="Inicio"
        icon={({ focused }) => (
          <View style={styles.iconContainer}>
            <Home size={22} color={focused ? "#ff6b6b" : "#666"} />
          </View>
        )}
        onPress={() => props.navigation.navigate("Home")}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
        activeTintColor="#ff6b6b"
        inactiveTintColor="#333"
      />
      <DrawerItem
        label="Invitados"
        icon={({ focused }) => (
          <View style={styles.iconContainer}>
            <Users size={22} color={focused ? "#ff6b6b" : "#666"} />
          </View>
        )}
        onPress={() => props.navigation.navigate("Invitados")}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
        activeTintColor="#ff6b6b"
        inactiveTintColor="#333"
      />
      <DrawerItem
        label="Promos"
        icon={({ focused }) => (
          <View style={styles.iconContainer}>
            <Gift size={22} color={focused ? "#ff6b6b" : "#666"} />
          </View>
        )}
        onPress={() => props.navigation.navigate("Promociones")}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
        activeTintColor="#ff6b6b"
        inactiveTintColor="#333"
      />
      <DrawerItem
        label="Proveedores"
        icon={({ focused }) => (
          <View style={styles.iconContainer}>
            <Building size={22} color={focused ? "#ff6b6b" : "#666"} />
          </View>
        )}
        onPress={() => props.navigation.navigate("Providers")}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
        activeTintColor="#ff6b6b"
        inactiveTintColor="#333"
      />
      <DrawerItem
        label="Comunidad"
        icon={({ focused }) => (
          <View style={styles.iconContainer}>
            <Building size={22} color={focused ? "#ff6b6b" : "#666"} />
          </View>
        )}
        onPress={() => props.navigation.navigate("Forms")}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
        activeTintColor="#ff6b6b"
        inactiveTintColor="#333"
      />
      <DrawerItem
        label="Ayuda"
        icon={({ focused }) => (
          <View style={styles.iconContainer}>
            <HelpCircle size={22} color={focused ? "#ff6b6b" : "#666"} />
          </View>
        )}
        onPress={() => { }}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
        activeTintColor="#ff6b6b"
        inactiveTintColor="#333"
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#ff6b6b",
        drawerInactiveTintColor: "#333",
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      {/* Main Screens - Accessible from Drawer */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ 
          title: "Inicio",
          drawerLabel: "Inicio"
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ 
          title: "Perfil",
          drawerLabel: "Perfil"
        }}
      />
      <Drawer.Screen
        name="Invitados"
        component={InvitadosScreen}
        options={{ 
          title: "Invitados",
          drawerLabel: "Invitados"
        }}
      />
      <Drawer.Screen
        name="Promociones"
        component={PromocionesScreen}
        options={{ 
          title: "Promociones",
          drawerLabel: "Promos"
        }}
      />
      <Drawer.Screen
        name="Providers"
        component={ProvidersScreen}
        options={{ 
          title: "Proveedores",
          drawerLabel: "Proveedores"
        }}
      />
      <Drawer.Screen
        name="Forms"
        component={FormsScreen}
        options={{ 
          title: "Comunidad",
          drawerLabel: "Comunidad"
        }}
      />
      
      {/* Secondary Screens - Not in drawer menu but accessible */}
      <Drawer.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{ 
          title: "Agenda",
          drawerLabel: "Agenda",
          headerShown: true
        }}
      />
      <Drawer.Screen
        name="Costos"
        component={CostosScreen}
        options={{ 
          title: "Costos",
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Cuentas"
        component={CuentasScreen}
        options={{ 
          title: "Cuentas",
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Tareas"
        component={TareasStack}
        options={{ 
          title: "Tareas",
          drawerLabel: "Tareas"
        }}
      />

      <Drawer.Screen
        name="Preparativos"
        component={PreparativosScreen}
        options={{ 
          title: "Preparativos",
          drawerLabel: "Preparativos"
        }}
      />
      <Drawer.Screen
        name="Roles"
        component={RolesScreen}
        options={{ 
          title: "Roles",
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Pantalla"
        component={PantallaScreen}
        options={{ 
          title: "Pantalla",
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Idioma"
        component={IdiomaScreen}
        options={{ 
          title: "Idioma",
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  menuIconContainer: {
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 20,
    color: "#333",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff6b6b",
  },
  drawerItem: {
    marginVertical: 0,
    marginHorizontal: 0,
    borderRadius: 0,
  },
  iconContainer: {
    width: 30,
    marginRight: 10,
    alignItems: "center",
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 0,
  },
});

