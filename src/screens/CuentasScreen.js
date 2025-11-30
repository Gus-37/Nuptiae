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
import { Menu, Users, ArrowLeft, ChevronRight, User, Bell, Activity, Globe, Monitor, Home, ShoppingCart, Calendar, Copy, LogOut } from "lucide-react-native";
import { getUserData, logoutUser } from '../services/authService';
import { getSharedAccountInfo } from '../services/accountService';
import { auth } from '../config/firebaseConfig';
import { useUISettings } from '../context/UISettingsContext';
import { useLanguage } from '../context/LanguageContext';
import { CommonActions } from '@react-navigation/native';

export default function CuentasScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const { t } = useLanguage();
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
          
          const currentUserAccount = accountInfo.account.members.find(
            member => member.uid === currentUser.uid
          );
          
          if (currentUserAccount) {
            let avatar = "👤";
            if (currentUserAccount.gender === 'Femenino' || currentUserAccount.role === 'Novia') {
              avatar = "👰";
            } else if (currentUserAccount.gender === 'Masculino' || currentUserAccount.role === 'Novio') {
              avatar = "🤵";
            }
            
            const formattedAccount = {
              id: currentUserAccount.uid,
              name: currentUserAccount.name || currentUser.displayName || currentUserAccount.email?.split('@')[0] || 'Usuario',
              role: currentUserAccount.role === 'owner' ? t("creator") : t("member"),
              avatar: avatar,
              email: currentUserAccount.email,
              gender: currentUserAccount.gender,
            };
            
            console.log('Cuenta del usuario actual:', formattedAccount);
            setAccounts([formattedAccount]);
          }
        } else {
          console.error('Error al obtener cuenta:', accountInfo.error);
          Alert.alert(t("error"), accountInfo.error);
        }
      } else {
        console.log('Usuario sin código de cuenta compartida');
      }
    } catch (error) {
      console.error('Error al cargar información:', error);
      Alert.alert(t("error"), 'No se pudo cargar la información de la cuenta: ' + error.message);
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
      t("logout"),
      t("logoutConfirm"),
      [
        {
          text: t("cancel"),
          style: 'cancel'
        },
        {
          text: t("logout"),
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert(t("error"), 'No se pudo cerrar sesión');
            }
          }
        }
      ]
    );
  };

  const menuOptions = [
    { id: 1, icon: User, label: t("editProfile"), description: t("editProfileDesc"), color: colors.accent },
    { id: 2, icon: Bell, label: t("notifications"), description: t("notificationsDesc"), color: colors.text },
    { id: 3, icon: Activity, label: t("recentActivity"), description: t("recentActivityDesc"), color: colors.text },
    { id: 4, icon: Globe, label: t("languageRegion"), description: t("languageRegionDesc"), color: colors.text },
    { id: 5, icon: Monitor, label: t("displaySettings"), description: t("displaySettingsDesc"), color: colors.text },
    { id: 6, icon: LogOut, label: t("logout"), description: t("logoutDesc"), color: colors.accent },
  ];

  const handleMenuPress = (id) => {
    if (id === 1) navigation.navigate('ProfileEdit');
    else if (id === 2) navigation.navigate('Notifications');
    else if (id === 3) navigation.navigate('Activity');
    else if (id === 4) navigation.navigate('Language');
    else if (id === 5) navigation.navigate('Pantalla');
    else if (id === 6) handleLogout();
  };

  if (selectedAccount) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "left", "right"]}>
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setSelectedAccount(null)}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>
              {t("account")}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.profileSection}>
              <View style={[styles.avatarContainer, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#2A2A2A' }]}>
                <Text style={styles.avatarLarge}>{selectedAccount.avatar}</Text>
              </View>
              <Text style={[styles.profileName, { color: colors.text, fontSize: 20 * fontScale }]}>{selectedAccount.name}</Text>
              <Text style={[styles.profileRole, { color: colors.muted, fontSize: 16 * fontScale }]}>{selectedAccount.role}</Text>
            </View>

            <View style={styles.menuSection}>
              {menuOptions.map((option) => {
                const IconComponent = option.icon && typeof option.icon === 'function' ? option.icon : User;
                return (
                  <TouchableOpacity 
                    key={option.id} 
                    style={[styles.menuItem, { borderBottomColor: colors.border }]}
                    onPress={() => handleMenuPress(option.id)} // << usar el manejador común
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.iconCircle, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#2A2A2A' }]}>
                        <IconComponent size={20} color={option.color} />
                      </View>
                      <View style={styles.menuItemTextContainer}>
                        <Text style={[styles.menuItemText, { color: colors.text, fontSize: 16 * fontScale }]}>{option.label}</Text>
                        <Text style={[styles.menuItemDescription, { color: colors.muted, fontSize: 12 * fontScale }]}>{option.description}</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color={colors.muted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
              <Home size={24} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Costos", { tab: "compras" })}>
              <ShoppingCart size={24} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
              <Calendar size={24} color={colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Users size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top","left","right"]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>
            {t("accountSettings")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {/* Código de cuenta */}
            {accountCode && (
              <View style={styles.section}>
                <View style={styles.codeSection}>
                  <View style={styles.codeContainer}>
                    <Text style={[styles.accountNumber, { color: colors.text }]}>{accountCode}</Text>
                    <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                      <Copy size={20} color={colors.accent} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.accountLabel, { color: colors.muted }]}>
                    {t("accountCode")}
                  </Text>
                  <Text style={[styles.accountHint, { color: colors.muted }]}>
                    {t("shareCode")}
                  </Text>
                </View>
              </View>
            )}

            {/* Lista de cuentas */}
            <View style={styles.accountsContainer}>
              {accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.accountCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setSelectedAccount(account)}
                >
                  <View style={[styles.avatar, { backgroundColor: theme === 'light' ? '#f0f0f0' : '#2A2A2A' }]}>
                    <Text style={styles.avatarEmoji}>{account.avatar}</Text>
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={[styles.accountName, { color: colors.text, fontSize: 16 * fontScale }]}>{account.name}</Text>
                    <Text style={[styles.accountRole, { color: colors.muted, fontSize: 14 * fontScale }]}>{account.role}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Menú */}
            <View style={styles.menuSection}>
              {menuOptions.map((option) => {
                const IconComponent = option.icon && typeof option.icon === 'function' ? option.icon : User;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.menuItem, { borderBottomColor: colors.border }]}
                    onPress={() => handleMenuPress(option.id)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.iconCircle, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#2A2A2A' }]}>
                        <IconComponent size={20} color={option.color} />
                      </View>
                      <View style={styles.menuItemTextContainer}>
                        <Text style={[styles.menuItemText, { color: colors.text, fontSize: 16 * fontScale }]}>{option.label}</Text>
                        <Text style={[styles.menuItemDescription, { color: colors.muted, fontSize: 12 * fontScale }]}>{option.description}</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color={colors.muted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <Home size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Costos", { tab: "compras" })}>
            <ShoppingCart size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
            <Calendar size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Users size={24} color={colors.accent} />
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
