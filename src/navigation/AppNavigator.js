import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterStep1 from "../screens/RegisterStep1";
import RegisterStep2 from "../screens/RegisterStep2";
import RegisterPush from "../screens/RegisterPush";
import DrawerNavigator from "./DrawerNavigator";
import VestidosScreen from "../screens/VestidosScreen";
import FloristeriasScreen from "../screens/FloristeriasScreen";
import TrajesScreen from "../screens/TrajesScreen";
import AccesoriosScreen from "../screens/AccesoriosScreen";
import FotografiaScreen from "../screens/FotografiaScreen";
import VideoScreen from "../screens/VideoScreen";
import PromocionesScreen from "../screens/PromocionesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterStep1" component={RegisterStep1} />
      <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
      <Stack.Screen name="RegisterPush" component={RegisterPush} />
      <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
      <Stack.Screen name="Vestidos" component={VestidosScreen} />
      <Stack.Screen name="Floristerias" component={FloristeriasScreen} />
      <Stack.Screen name="Trajes" component={TrajesScreen} />
      <Stack.Screen name="Accesorios" component={AccesoriosScreen} />
      <Stack.Screen name="Fotografia" component={FotografiaScreen} />
      <Stack.Screen name="Video" component={VideoScreen} />
      <Stack.Screen name="Promociones" component={PromocionesScreen} />
    </Stack.Navigator>
  );
}
