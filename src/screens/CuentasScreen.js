import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, Users, ArrowLeft, ChevronRight, User, Lock, Activity, Globe, Monitor, Home, ShoppingCart, Calendar, Copy, LogOut } from "lucide-react-native";
import { getUserData, logoutUser } from '../services/authService';
import { getSharedAccountInfo } from '../services/accountService';
import { auth } from '../config/firebaseConfig';

export default function CuentasScreen({ navigation }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountCode, setAccountCode] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccountInfo();
  }, []);

  const loadAccountInfo = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('No hay usuario autenticado');
        setLoading(false);
        return;
      }

      console.log('Usuario actual:', currentUser.uid);
      const userData = await getUserData(currentUser.uid);
      console.log('Datos de usuario:', userData);

      if (userData.success && userData.data.sharedAccountCode) {
        console.log('Código de cuenta:', userData.data.sharedAccountCode);
        const accountInfo = await getSharedAccountInfo(userData.data.sharedAccountCode);
        console.log('Info de cuenta:', accountInfo);

        if (accountInfo.success) {
          setAccountCode(accountInfo.account.code);
          
          // Filtrar solo el usuario actual para mostrar en la lista
          const currentUserAccount = accountInfo.account.members.find(
            member => member.uid === currentUser.uid
          );
          
          if (currentUserAccount) {
            // El rol ya viene correcto desde accountInfo (userData.role)
            const userRole = currentUserAccount.role || 'Miembro';
            
            // Determinar avatar basado en género o rol
            let avatar = "👤"; // Default
            if (currentUserAccount.gender === 'Femenino' || userRole === 'Novia') {
              avatar = "👰";
            } else if (currentUserAccount.gender === 'Masculino' || userRole === 'Novio') {
              avatar = "🤵";
            }
            
            const formattedAccount = {
              id: currentUserAccount.uid,
              name: currentUserAccount.name || currentUser.displayName || currentUserAccount.email?.split('@')[0] || 'Usuario',
              role: userRole,
              avatar: avatar,
              email: currentUserAccount.email,
              gender: currentUserAccount.gender,
            };
            
            console.log('Cuenta del usuario actual:', formattedAccount);
            setAccounts([formattedAccount]);
          }
        } else {
          console.error('Error al obtener cuenta:', accountInfo.error);
          Alert.alert('Error', accountInfo.error);
        }
      } else {
        console.log('Usuario sin código de cuenta compartida');
      }
    } catch (error) {
      console.error('Error al cargar información:', error);
      Alert.alert('Error', 'No se pudo cargar la información de la cuenta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (accountCode) {
      try {
        await Share.share({
          message: `Código de cuenta Nuptiae: ${accountCode}\n\nUsa este código para unirte a nuestra cuenta compartida.`
        });
      } catch (error) {
        Alert.alert('Código', accountCode);
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
        }
      ]
    );
  };

  const menuOptions = [
    { id: 1, icon: User, label: "Editar Perfil", description: "Nombre, correo, foto de perfil", color: "#ff6b6b" },
    { id: 2, icon: Lock, label: "Cambiar Contraseña", description: "Actualiza tu contraseña de acceso", color: "#333" },
    { id: 3, icon: Activity, label: "Actividad Reciente", description: "Historial de acciones en la cuenta", color: "#333" },
    { id: 4, icon: Globe, label: "Idioma y Región", description: "Español, México", color: "#333" },
    { id: 5, icon: Monitor, label: "Configuración de Pantalla", description: "Tema, notificaciones, privacidad", color: "#333" },
    { id: 6, icon: LogOut, label: "Cerrar Sesión", description: "Salir de tu cuenta", color: "#ff6b6b" },
  ];

  if (selectedAccount) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedAccount(null)}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cuenta</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarLarge}>{selectedAccount.avatar}</Text>
              </View>
              <Text style={styles.profileName} numberOfLines={2}>{selectedAccount.name}</Text>
              <Text style={styles.profileRole} numberOfLines={1}>{selectedAccount.role}</Text>
            </View>

            <View style={styles.menuSection}>
              {menuOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity 
                    key={option.id} 
                    style={styles.menuItem}
                    onPress={() => {
                      if (option.id === 4) {
                        navigation.navigate("Idioma");
                      } else if (option.id === 5) {
                        navigation.navigate("Pantalla");
                      } else if (option.id === 6) {
                        handleLogout();
                      }
                    }}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.iconCircle, (option.id === 1 || option.id === 6) && styles.iconCircleHighlight]}>
                        <IconComponent size={20} color={option.color} />
                      </View>
                      <View style={styles.menuItemTextContainer}>
                        <Text style={styles.menuItemText}>{option.label}</Text>
                        <Text style={styles.menuItemDescription}>{option.description}</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#999" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
              <Home size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate("Costos", { tab: "compras" })}
            >
              <ShoppingCart size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
              <Calendar size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Users size={24} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuración de cuentas</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6b6b" />
          </View>
        ) : (
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              {/* Código de cuenta */}
              {accountCode && (
                <View style={styles.codeSection}>
                  <View style={styles.codeContainer}>
                    <Text style={styles.accountNumber}>{accountCode}</Text>
                    <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                      <Copy size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.accountLabel}>Código de cuenta</Text>
                  <Text style={styles.accountHint}>Comparte este código con tu pareja</Text>
                </View>
              )}

              {/* Lista de cuentas */}
              <View style={styles.accountsContainer}>
                {accounts.map((account) => (
                <TouchableOpacity 
                  key={account.id} 
                  style={styles.accountCard}
                  onPress={() => setSelectedAccount(account)}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>{account.avatar}</Text>
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName} numberOfLines={1}>{account.name}</Text>
                    <Text style={styles.accountRole} numberOfLines={1}>{account.role}</Text>
                  </View>
                  <ChevronRight size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.plannerButton}>
              <Text style={styles.plannerButtonText}>Planner de boda</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <Home size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate("Costos", { tab: "compras" })}
          >
            <ShoppingCart size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
            <Calendar size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Users size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
  },
  codeSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#333",
  },
  copyButton: {
    padding: 8,
  },
  accountLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  accountHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  accountsContainer: {
    width: "100%",
    marginBottom: 40,
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  accountRole: {
    fontSize: 14,
    color: "#666",
  },
  plannerButton: {
    backgroundColor: "#FFE5E5",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  plannerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b6b",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarLarge: {
    fontSize: 48,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: "#666",
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleHighlight: {
    backgroundColor: "#FFE5E5",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    color: "#999",
  },
});
