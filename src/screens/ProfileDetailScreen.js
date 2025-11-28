import React, { useState } from 'react';
import { 
  StatusBar, 
  Alert, 
  Pressable, 
  TextInput, 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  ImageBackground 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, AvatarImage } from '@gluestack-ui/themed';
import { ChevronLeft, Camera, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, role, avatar, username, bgColor } = route.params;

  const [userAvatar, setUserAvatar] = useState(avatar);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  const [email, setEmail] = useState('usuario@correo.com');
  const [phone, setPhone] = useState('+52 123 456 7890');
  const [birthDate, setBirthDate] = useState(new Date('1990-01-01'));
  const [bio, setBio] = useState('Escribe algo sobre ti...');
  const [avatarColor, setAvatarColor] = useState(bgColor);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChangePhoto = () => {
    Alert.alert('Cambiar foto', 'Aquí puedes integrar un selector de imagen.');
  };

  const handleSave = () => {
    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    Alert.alert('Perfil actualizado', 'Tus cambios se han guardado correctamente.');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#FF7700" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header con fondo */}
        <ImageBackground 
          source={{uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?fit=crop&w=600&q=60'}} 
          style={styles.headerBackground}
          imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
          alt="Fondo de perfil"
        >
          <Pressable onPress={() => navigation.goBack()} style={{ padding: 12 }}>
            <ChevronLeft size={28} color="#fff" />
          </Pressable>
          <View style={styles.avatarSection}>
            <Pressable onPress={handleChangePhoto}>
              <Avatar size="2xl" mb={8} bg={avatarColor}>
                <AvatarImage source={{ uri: userAvatar }} alt={name} />
                <Camera size={22} color="#fff" style={styles.cameraIcon} />
              </Avatar>
            </Pressable>
            <Text style={styles.name} numberOfLines={2}>{name}</Text>
            <Text style={styles.role} numberOfLines={1}>{role}</Text>
            <Text style={styles.username} numberOfLines={1}>Usuario: {username}</Text>
          </View>
        </ImageBackground>

        {/* Información Personal */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <TextInput 
            style={styles.textInput} 
            value={email} 
            onChangeText={setEmail} 
            placeholder="Correo electrónico" 
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.textInput} 
            value={phone} 
            onChangeText={setPhone} 
            placeholder="Teléfono" 
            keyboardType="phone-pad"
          />

          {/* Selector de Fecha */}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <TextInput 
              style={styles.textInput} 
              placeholder="Fecha de nacimiento" 
              value={birthDate.toISOString().split('T')[0]} 
              editable={false} 
            />
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setBirthDate(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <TextInput 
            style={[styles.textInput, { height: 80 }]} 
            value={bio} 
            onChangeText={setBio} 
            placeholder="Bio / Descripción" 
            multiline
          />
        </View>

        {/* Cambiar Contraseña */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              placeholder="Nueva contraseña" 
              placeholderTextColor="#999" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={secureText}
            />
            <Pressable onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
              {secureText ? <EyeOff size={20} color="#999"/> : <Eye size={20} color="#999"/>}
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput} 
              placeholder="Confirmar contraseña" 
              placeholderTextColor="#999" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry={secureConfirmText}
            />
            <Pressable onPress={() => setSecureConfirmText(!secureConfirmText)} style={styles.eyeIcon}>
              {secureConfirmText ? <EyeOff size={20} color="#999"/> : <Eye size={20} color="#999"/>}
            </Pressable>
          </View>
        </View>

        {/* Botón Guardar */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  headerBackground: { paddingBottom: 24 },
  avatarSection: { alignItems: 'center', marginTop: 16 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0 },
  name: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 8, textAlign: 'center' },
  role: { fontSize: 16, color: '#fff', marginTop: 4, textAlign: 'center', letterSpacing: 0.5 },
  username: { fontSize: 16, color: '#fff', marginTop: 2, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#444' },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 40,
    backgroundColor: '#fefefe',
    marginBottom: 12,
    color: '#333',
  },
  inputContainer: { position: 'relative', marginBottom: 12 },
  eyeIcon: { position: 'absolute', right: 12, top: 15 },
  saveButton: {
    backgroundColor: '#FF7700',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    shadowColor: '#FF7700',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
