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

// Profile Stack Screens
import ProfileDetailScreen from "../screens/ProfileDetailScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import LanguageScreen from "../screens/LanguageScreen";
import DisplayScreen from "../screens/DisplayScreen";
import SharedAccountScreen from "../screens/SharedAccountScreen";

// Tareas Stack Screens
import AddTareaScreen from "../screens/AddTareaScreen";

// Invitados Stack Screens
import AddInvitadoScreen from "../screens/AddInvitadoScreen";

// Agenda Stack Screens
import AddItinerarioScreen from "../screens/AddItinerarioScreen";
import CalendarAgendaScreen from "../screens/CalendarAgendaScreen";
import ItinerarioScreen from "../screens/ItinerarioScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterStep1" component={RegisterStep1} />
      <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
      <Stack.Screen name="RegisterPush" component={RegisterPush} />
      
      {/* Main Drawer Navigation */}
      <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
      
      {/* Provider Category Screens */}
      <Stack.Screen name="Vestidos" component={VestidosScreen} />
      <Stack.Screen name="Floristerias" component={FloristeriasScreen} />
      <Stack.Screen name="Trajes" component={TrajesScreen} />
      <Stack.Screen name="Accesorios" component={AccesoriosScreen} />
      <Stack.Screen name="Fotografia" component={FotografiaScreen} />
      <Stack.Screen name="Video" component={VideoScreen} />
      <Stack.Screen name="Promociones" component={PromocionesScreen} />
      
      {/* Profile Stack Screens */}
      <Stack.Screen 
        name="ProfileDetail" 
        component={ProfileDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="SharedAccount" 
        component={SharedAccountScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="DisplayScreen" 
        component={DisplayScreen}
        options={{ animation: 'slide_from_right' }}
      />
      
      {/* Tareas Stack Screens */}
      <Stack.Screen 
        name="AddTarea" 
        component={AddTareaScreen}
        options={{ 
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
      
      {/* Invitados Stack Screens */}
      <Stack.Screen 
        name="AddInvitado" 
        component={AddInvitadoScreen}
        options={{ 
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
      
      {/* Agenda Stack Screens */}
      <Stack.Screen 
        name="AddItinerario" 
        component={AddItinerarioScreen}
        options={{ 
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="CalendarAgenda" 
        component={CalendarAgendaScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Itinerario" 
        component={ItinerarioScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
