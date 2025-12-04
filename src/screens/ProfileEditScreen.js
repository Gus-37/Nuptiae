import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';
import { auth, database } from '../config/firebaseConfig';
import { ref as dbRef, get, update } from 'firebase/database';
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from 'firebase/auth';
import { DeviceEventEmitter } from 'react-native';
import { useUISettings } from '../context/UISettingsContext';

export default function ProfileEditScreen({ navigation }) {
  const { colors, fontScale, theme } = useUISettings();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) {
          Alert.alert("Sesión", "No hay usuario");
          navigation.goBack();
          return;
        }
        const snap = await get(dbRef(database, `users/${user.uid}`));
        const data = snap.exists() ? snap.val() : {};
        setDisplayName(user.displayName || data.name || '');
        setEmail(user.email || data.email || '');
      } catch (e) {
        Alert.alert("Error", "Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigation]);

  const maybeReauth = async (willChangeEmail) => {
    if (!willChangeEmail) return;
    if (!currentPassword) throw new Error("Ingresa tu contraseña actual");
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
  };

  const onSave = async () => {
    try {
      if (!user) return;
      setSaving(true);
      const newEmail = email.trim();
      const willChangeEmail = newEmail !== user.email;

      await maybeReauth(willChangeEmail);

      const authUpdates = [];

      // Enviar verificación al nuevo correo antes de actualizarlo
      if (willChangeEmail) {
        await verifyBeforeUpdateEmail(user, newEmail);
        Alert.alert(
          "Verificación requerida",
          "Se envió un correo para verificar tu email"
        );
      }

      const needsProfile = displayName !== (user.displayName || '');
      if (needsProfile) authUpdates.push(updateProfile(user, { displayName }));

      if (authUpdates.length) await Promise.all(authUpdates);

      // Actualiza tu base de datos con los datos visibles; el email final se confirmará tras la verificación
      await update(dbRef(database, `users/${user.uid}`), {
        name: displayName,
        email: newEmail,
        updatedAt: new Date().toISOString(),
      });

      DeviceEventEmitter.emit('profileUpdated', { name: displayName, email: newEmail });
      Alert.alert(
        "Éxito", 
        willChangeEmail ? "Nombre actualizado. Verifica tu nuevo email." : "Perfil actualizado correctamente"
      );
      navigation.goBack();
    } catch (e) {
      console.log('Save error:', e);
      let msg = e.message || "Error al guardar cambios";
      if (e.code === 'auth/requires-recent-login') {
        msg = "Requiere inicio de sesión reciente";
      } else if (e.code === 'auth/operation-not-allowed') {
        msg = "Operación no permitida";
      }
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top','left','right']}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Editar Perfil</Text>
        <TouchableOpacity disabled={saving} onPress={onSave}>
          <Save size={22} color={saving ? colors.muted : colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Nombre</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Ingresa tu nombre"
          placeholderTextColor={colors.muted}
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Correo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Ingresa tu correo"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: colors.text, fontSize: 14 * fontScale }]}>Contraseña actual</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor={colors.muted}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: colors.accent }, saving && { opacity: 0.6 }]} 
          disabled={saving} 
          onPress={onSave}
        >
          <Text style={[styles.saveBtnText, { fontSize: 16 * fontScale }]}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  headerTitle: { fontWeight: '600' },
  content: { padding: 16, paddingBottom: 40 },
  label: { fontWeight: '500', marginTop: 18, marginBottom: 6 },
  input: { height: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
  saveBtn: { marginTop: 30, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
