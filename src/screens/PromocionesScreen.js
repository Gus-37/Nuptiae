import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Tag } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";

export default function PromocionesScreen({ navigation }) {
    const { colors, fontScale, theme } = useUISettings();

    const promociones = [
        { id: 1, title: "20% OFF en Fotografía", discount: "20%", image: "https://images.pexels.com/photos/265685/pexels-photo-265685.jpeg?auto=compress&cs=tinysrgb&w=600" },
        { id: 2, title: "15% OFF en Video", discount: "15%", image: "https://images.pexels.com/photos/2608516/pexels-photo-2608516.jpeg?auto=compress&cs=tinysrgb&w=600" },
        { id: 3, title: "10% OFF en Vestidos", discount: "10%", image: "https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=600" },
        { id: 4, title: "25% OFF en Floristerías", discount: "25%", image: "https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=600" },
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} />
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Promociones</Text>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView style={styles.scrollContent} contentContainerStyle={{ padding: 16 }}>
                    {promociones.map((item) => (
                        <TouchableOpacity key={item.id} style={[styles.promoCard, { backgroundColor: colors.card }]}>
                            <Image source={{ uri: item.image }} style={styles.promoImage} />
                            <View style={styles.promoContent}>
                                <View style={styles.promoLeft}>
                                    <Text style={[styles.promoTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{item.title}</Text>
                                    <View style={styles.discountBadge}>
                                        <Tag size={14} color={colors.accent} />
                                        <Text style={[styles.discountText, { color: colors.accent, fontSize: 13 * fontScale }]}>{item.discount} descuento</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    scrollContent: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
    headerTitle: { fontWeight: "600" },
    headerButton: { padding: 4, width: 32 },
    promoCard: { borderRadius: 12, marginBottom: 16, overflow: "hidden" },
    promoImage: { width: "100%", height: 160, resizeMode: "cover", backgroundColor: "#f0f0f0" },
    promoContent: { padding: 14 },
    promoLeft: { flex: 1 },
    promoTitle: { fontWeight: "600", marginBottom: 8 },
    discountBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
    discountText: { fontWeight: "600" },
});
