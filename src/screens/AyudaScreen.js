import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Mail, Phone, MessageCircle, BookOpen, HelpCircle } from 'lucide-react-native';
import { useUISettings } from '../context/UISettingsContext';

export default function AyudaScreen({ navigation }) {
  const { theme, fontScale, colors } = useUISettings();

  const contactOptions = [
    {
      icon: Mail,
      title: 'Correo Electrónico',
      description: 'soporte@nuptiae.com',
      action: () => Linking.openURL('mailto:soporte@nuptiae.com')
    },
    {
      icon: Phone,
      title: 'Teléfono',
      description: '+52 (123) 456-7890',
      action: () => Linking.openURL('tel:+521234567890')
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chatea con nosotros',
      action: () => Linking.openURL('https://wa.me/521234567890')
    }
  ];

  const faqItems = [
    {
      question: '¿Cómo agrego invitados a mi evento?',
      answer: 'Ve a la sección "Invitados" desde el menú principal y presiona el botón "+" para agregar nuevos invitados.'
    },
    {
      question: '¿Cómo comparto mi cuenta con mi pareja?',
      answer: 'En la sección "Cuentas" encontrarás la opción de "Cuenta Compartida" donde puedes generar un código para compartir.'
    },
    {
      question: '¿Cómo gestiono mi presupuesto?',
      answer: 'En la sección "Costos" puedes definir tu presupuesto total y agregar todos tus gastos para llevar un control detallado.'
    },
    {
      question: '¿Puedo usar la app sin conexión?',
      answer: 'Algunas funciones están disponibles sin conexión, pero necesitas internet para sincronizar tus datos.'
    },
    {
      question: '¿Cómo cambio el tema de la aplicación?',
      answer: 'Ve a tu perfil y selecciona "Pantalla" para cambiar entre modo claro y oscuro.'
    }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} backgroundColor={colors.bg} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: 20 * fontScale }]}>Centro de Ayuda</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Intro */}
          <View style={styles.section}>
            <View style={styles.iconHeader}>
              <HelpCircle size={48} color={colors.accent} />
            </View>
            <Text style={[styles.welcomeText, { color: colors.text, fontSize: 16 * fontScale }]}>
              ¿En qué podemos ayudarte?
            </Text>
            <Text style={[styles.subtitleText, { color: colors.muted, fontSize: 14 * fontScale }]}>
              Estamos aquí para hacer que tu experiencia de planificación sea perfecta
            </Text>
          </View>

          {/* Contact Options */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 18 * fontScale }]}>
              Contacta con Soporte
            </Text>
            {contactOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={option.action}
              >
                <View style={[styles.iconCircle, { backgroundColor: colors.bg }]}>
                  <option.icon size={24} color={colors.accent} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.text, fontSize: 16 * fontScale }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.contactDescription, { color: colors.muted, fontSize: 14 * fontScale }]}>
                    {option.description}
                  </Text>
                </View>
                <ArrowLeft size={20} color={colors.muted} style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ Section */}
          <View style={styles.section}>
            <View style={styles.faqHeader}>
              <BookOpen size={24} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 18 * fontScale, marginLeft: 8 }]}>
                Preguntas Frecuentes
              </Text>
            </View>
            
            {faqItems.map((item, index) => (
              <View
                key={index}
                style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={[styles.faqQuestion, { color: colors.text, fontSize: 15 * fontScale }]}>
                  {item.question}
                </Text>
                <Text style={[styles.faqAnswer, { color: colors.muted, fontSize: 14 * fontScale }]}>
                  {item.answer}
                </Text>
              </View>
            ))}
          </View>

          {/* App Info */}
          <View style={[styles.section, styles.infoSection]}>
            <Text style={[styles.appVersion, { color: colors.muted, fontSize: 12 * fontScale }]}>
              Nuptiae v1.0.0
            </Text>
            <Text style={[styles.appInfo, { color: colors.muted, fontSize: 12 * fontScale }]}>
              © 2024 Nuptiae. Todos los derechos reservados.
            </Text>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    lineHeight: 18,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  faqCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  faqQuestion: {
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  faqAnswer: {
    lineHeight: 20,
  },
  infoSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 32,
  },
  appVersion: {
    marginBottom: 4,
  },
  appInfo: {
    textAlign: 'center',
  },
});
