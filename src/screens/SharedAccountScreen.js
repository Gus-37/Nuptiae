import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Copy, Users, LogOut } from 'lucide-react-native';
import { getSharedAccountInfo, joinSharedAccount, leaveSharedAccount } from '../services/accountService';
import { auth } from '../config/firebaseConfig';

export default function SharedAccountScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joiningAccount, setJoiningAccount] = useState(false);
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    loadAccountInfo();
  }, []);

  const loadAccountInfo = async () => {
    setLoading(true);
    try {
      const userRef = auth.currentUser;
      if (!userRef) return;

      // Obtener el código de cuenta del usuario desde Firebase
      const { getUserData } = require('../services/authService');
      const userData = await getUserData(userRef.uid);
      
      if (userData.success && userData.data.sharedAccountCode) {
        const result = await getSharedAccountInfo(userData.data.sharedAccountCode);
        if (result.success) {
          setAccountInfo(result.account);
        }
      }
    } catch (error) {
      console.error('Error al cargar cuenta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAccount = async () => {
    if (!joinCode || joinCode.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa un código de cuenta');
      return;
    }

    setJoiningAccount(true);
    const result = await joinSharedAccount(currentUserId, joinCode.trim());
    setJoiningAccount(false);

    if (result.success) {
      Alert.alert('¡Éxito!', 'Te has unido a la cuenta compartida', [
        {
          text: 'OK',
          onPress: () => {
            setJoinCode('');
            loadAccountInfo();
          }
        }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleCopyCode = async () => {
    if (accountInfo?.code) {
      try {
        await Share.share({
          message: `Código de cuenta Nuptiae: ${accountInfo.code}\n\nUsa este código para unirte a nuestra cuenta compartida.`
        });
      } catch (error) {
        Alert.alert('Código copiado', accountInfo.code);
      }
    }
  };

  const handleLeaveAccount = () => {
    Alert.alert(
      'Salir de cuenta compartida',
      '¿Estás seguro de que quieres salir de esta cuenta? Perderás acceso a la información compartida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            if (accountInfo?.code) {
              setLoading(true);
              const result = await leaveSharedAccount(currentUserId, accountInfo.code);
              setLoading(false);

              if (result.success) {
                Alert.alert('Éxito', 'Has salido de la cuenta compartida', [
                  {
                    text: 'OK',
                    onPress: () => {
                      setAccountInfo(null);
                      loadAccountInfo();
                    }
                  }
                ]);
              } else {
                Alert.alert('Error', result.error);
              }
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cuenta Compartida</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6b6b" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuenta Compartida</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {accountInfo ? (
          <View>
            {/* Información de la cuenta actual */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Users size={24} color="#ff6b6b" />
                <Text style={styles.cardTitle}>Tu Cuenta Compartida</Text>
              </View>

              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Código de cuenta:</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{accountInfo.code}</Text>
                  <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                    <Copy size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.codeHint}>
                  Comparte este código con tu pareja para que se una a tu cuenta
                </Text>
              </View>

              {/* Miembros */}
              <View style={styles.membersSection}>
                <Text style={styles.sectionTitle}>
                  Miembros ({accountInfo.members?.length || 0}/2)
                </Text>
                {accountInfo.members?.map((member, index) => (
                  <View key={member.uid} style={styles.memberItem}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>
                        {member.name?.charAt(0).toUpperCase() || '?'}
                      </Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberEmail}>{member.email}</Text>
                      <Text style={styles.memberRole}>
                        {member.role === 'owner' ? 'Creador' : 'Miembro'}
                        {member.uid === currentUserId && ' (Tú)'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Botón para salir */}
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={handleLeaveAccount}
              >
                <LogOut size={20} color="#fff" />
                <Text style={styles.leaveButtonText}>Salir de esta cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {/* No tiene cuenta compartida */}
            <View style={styles.card}>
              <View style={styles.emptyState}>
                <Users size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No tienes cuenta compartida</Text>
                <Text style={styles.emptyText}>
                  Obtuviste un código al registrarte, o puedes unirte a una cuenta existente
                </Text>
              </View>
            </View>

            {/* Unirse a cuenta */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Unirse a una cuenta</Text>
              <Text style={styles.cardDescription}>
                Si tu pareja ya se registró, ingresa el código de su cuenta para unirte
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Código de 6 dígitos"
                value={joinCode}
                onChangeText={setJoinCode}
                keyboardType="number-pad"
                maxLength={6}
                editable={!joiningAccount}
              />

              <TouchableOpacity
                style={[styles.joinButton, joiningAccount && styles.disabledButton]}
                onPress={handleJoinAccount}
                disabled={joiningAccount}
              >
                {joiningAccount ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.joinButtonText}>Unirse a cuenta</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 4,
  },
  copyButton: {
    padding: 8,
  },
  codeHint: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  membersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: '600',
  },
  joinButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
