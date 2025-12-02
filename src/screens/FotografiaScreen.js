import React, { useState, useEffect } from "react";
import { useUISettings } from "../context/UISettingsContext";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { listenToProducts } from "../services/productsService";

export default function FotografiaScreen({ navigation }) {
    const { colors, fontScale, theme } = useUISettings();
    const [fotografos, setFotografos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenToProducts('fotografia', (products) => {
            setFotografos(products);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Fotografía</Text>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView style={styles.scrollContent}>
                    <TouchableOpacity style={[styles.locationContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                        <MapPin size={16} color={colors.accent} />
                        <Text style={[styles.locationText, { color: colors.text, fontSize: 15 * fontScale }]}>Aguascalientes</Text>
                    </TouchableOpacity>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={[styles.loadingText, { color: colors.muted, fontSize: 14 * fontScale }]}>Cargando productos...</Text>
                        </View>
                    ) : fotografos.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.muted, fontSize: 14 * fontScale }]}>No hay productos disponibles</Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {fotografos.map((item) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                                    onPress={() => navigation.navigate('ProductDetail', {
                                        product: item,
                                        category: 'Fotografía'
                                    })}
                                >
                                    <Image source={{ uri: item.image }} style={[styles.image, { backgroundColor: theme === 'light' ? '#f0f0f0' : colors.bg }]} alt={item.name} />
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.itemName, { color: colors.text, fontSize: 14 * fontScale }]} numberOfLines={1}>{item.name}</Text>
                                        <Text style={[styles.itemPrice, { color: colors.muted, fontSize: 13 * fontScale }]} numberOfLines={1}>{item.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
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
    scrollContent: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontWeight: "600",
    },
    headerButton: {
        padding: 4,
        width: 32,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    locationText: {
        marginLeft: 6,
        fontWeight: "500",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 12,
        justifyContent: "space-between",
    },
    card: {
        width: "48%",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
    },
    image: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
        backgroundColor: "#f0f0f0",
    },
    cardContent: {
        padding: 12,
    },
    itemName: {
        fontWeight: "600",
        marginBottom: 4,
    },
    itemPrice: {
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 14,
    },
});
