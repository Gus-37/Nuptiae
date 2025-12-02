import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const translations = {
  es: {
    // IdiomaScreen
    language: "Idioma",
    spanish: "Español",
    english: "Inglés",
    
    // HomeScreen
    welcomePrefix: "¡Bienvenidos",
    daysUntilWedding: (count) => `${count} día${count !== 1 ? 's' : ''} para tu boda`,
    explore: "Explora el catálogo para tu gran día",
    upcomingTasks: "Tareas próximas",
    
    // Categorías HomeScreen
    dresses: "Vestidos",
    churches: "Iglesias",
    food: "Comida",
    shoes: "Zapatos",
    
    // Tareas HomeScreen
    assignMaster: "Asignar maestro de ceremonias",
    songsList: "Lista de canciones nupciales",
    dueDate: (date) => `Fecha límite: ${date}`,
    
    // InvitadosScreen
    guests: "Invitados",
    noGuests: "No hay invitados. Presiona + para agregar uno.",
    addGuest: "Agregar Invitado",
    guestName: "Nombre",
    guestNamePlaceholder: "Nombre del invitado",
    guestRole: "Rol",
    guestRolePlaceholder: "Ej: Padrino de anillos",
    add: "Agregar",
    error: "Error",
    completeFields: "Por favor completa todos los campos",
    mustLogin: "Debes iniciar sesión",
    success: "Éxito",
    guestAdded: "Invitado agregado correctamente",
    guestAddError: (message) => `No se pudo agregar el invitado: ${message}`,
    
    // CuentasScreen
    accountSettings: "Configuración de cuentas",
    account: "Cuenta",
    accountCode: "Código de cuenta",
    shareCode: "Comparte este código con tu pareja",
    creator: "Creador",
    member: "Miembro",
    editProfile: "Editar Perfil",
    editProfileDesc: "Nombre, correo, foto de perfil",
    notifications: "Notificaciones",
    notificationsDesc: "Activar notificaciones",
    recentActivity: "Actividad Reciente",
    recentActivityDesc: "Historial de acciones en la cuenta",
    languageRegion: "Idioma y Región",
    languageRegionDesc: "Español, México",
    displaySettings: "Configuración de Pantalla",
    displaySettingsDesc: "Tema y tamaño de texto",
    logout: "Cerrar Sesión",
    logoutDesc: "Salir de tu cuenta",
    logoutConfirm: "¿Estás seguro que deseas cerrar sesión?",
    cancel: "Cancelar",
    loading: "Cargando...",
    
    // ProfileEditScreen
    editProfile: "Editar Perfil",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Correo",
    emailPlaceholder: "correo@dominio.com",
    currentPassword: "Contraseña actual (solo si cambias correo)",
    passwordPlaceholder: "••••••••",
    saveChanges: "Guardar cambios",
    saving: "Guardando...",
    session: "Sesión",
    noUser: "No hay usuario.",
    errorLoadProfile: "No se pudo cargar el perfil.",
    enterCurrentPassword: "Ingresa contraseña actual para cambiar el correo.",
    verificationRequired: "Verificación requerida",
    verificationMessage: "Te enviamos un correo de verificación al nuevo email. Verifícalo y vuelve a abrir la app para completar el cambio.",
    successTitle: "Éxito",
    profileUpdated: "Perfil actualizado.",
    nameUpdatedEmailPending: "Nombre actualizado. Revisa tu correo para confirmar el nuevo email.",
    errorSaving: "Error al guardar.",
    requiresRecentLogin: "Vuelve a iniciar sesión para cambiar el correo.",
    operationNotAllowed: "El cambio de correo requiere verificación previa. Revisa tu configuración de autenticación en Firebase.",
    
    // NotificationsScreen
    notifications: "Notificaciones",
    pushNotifications: "Push",
    emailNotifications: "Correo",
    
    // PantallaScreen
    display: "Pantalla",
    darkMode: "Modo oscuro",
    textSize: "Tamaño de texto",
    normal: "Normal",
    large: "Grande",
    extraLarge: "Extra Grande",
  },
  en: {
    // IdiomaScreen
    language: "Language",
    spanish: "Spanish",
    english: "English",
    
    // HomeScreen
    welcomePrefix: "Welcome",
    daysUntilWedding: (count) => `${count} day${count !== 1 ? 's' : ''} until your wedding`,
    explore: "Explore the catalog for your big day",
    upcomingTasks: "Upcoming tasks",
    
    // Categorías HomeScreen
    dresses: "Dresses",
    churches: "Churches",
    food: "Food",
    shoes: "Shoes",
    
    // Tareas HomeScreen
    assignMaster: "Assign master of ceremonies",
    songsList: "Wedding songs list",
    dueDate: (date) => `Due date: ${date}`,
    
    // InvitadosScreen
    guests: "Guests",
    noGuests: "No guests. Press + to add one.",
    addGuest: "Add Guest",
    guestName: "Name",
    guestNamePlaceholder: "Guest name",
    guestRole: "Role",
    guestRolePlaceholder: "Ex: Ring bearer",
    add: "Add",
    error: "Error",
    completeFields: "Please complete all fields",
    mustLogin: "You must log in",
    success: "Success",
    guestAdded: "Guest added successfully",
    guestAddError: (message) => `Could not add guest: ${message}`,
    
    // CuentasScreen
    accountSettings: "Account Settings",
    account: "Account",
    accountCode: "Account code",
    shareCode: "Share this code with your partner",
    creator: "Creator",
    member: "Member",
    editProfile: "Edit Profile",
    editProfileDesc: "Name, email, profile picture",
    notifications: "Notifications",
    notificationsDesc: "Enable notifications",
    recentActivity: "Recent Activity",
    recentActivityDesc: "Account action history",
    languageRegion: "Language & Region",
    languageRegionDesc: "English, USA",
    displaySettings: "Display Settings",
    displaySettingsDesc: "Theme and text size",
    logout: "Sign Out",
    logoutDesc: "Sign out of your account",
    logoutConfirm: "Are you sure you want to sign out?",
    cancel: "Cancel",
    loading: "Loading...",
    
    // ProfileEditScreen
    editProfile: "Edit Profile",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "email@domain.com",
    currentPassword: "Current password (only if changing email)",
    passwordPlaceholder: "••••••••",
    saveChanges: "Save changes",
    saving: "Saving...",
    session: "Session",
    noUser: "No user.",
    errorLoadProfile: "Could not load profile.",
    enterCurrentPassword: "Enter current password to change email.",
    verificationRequired: "Verification required",
    verificationMessage: "We sent a verification email to your new email. Verify it and reopen the app to complete the change.",
    successTitle: "Success",
    profileUpdated: "Profile updated.",
    nameUpdatedEmailPending: "Name updated. Check your email to confirm the new email.",
    errorSaving: "Error saving.",
    requiresRecentLogin: "Please sign in again to change your email.",
    operationNotAllowed: "Email change requires prior verification. Check your Firebase authentication settings.",
    
    // PantallaScreen
    display: "Display",
    darkMode: "Dark mode",
    textSize: "Text size",
    normal: "Normal",
    large: "Large",
    extraLarge: "Extra Large",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem("app_lang");
      if (saved) setLanguage(saved);
    } catch (error) {
      console.error("Error loading language:", error);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      setLanguage(lang);
      await AsyncStorage.setItem("app_lang", lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key, params) => {
    const text = translations[language]?.[key] || key;
    return typeof text === "function" ? text(params) : text;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);