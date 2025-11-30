import React, { useState, useEffect } from "react";
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

export default function AccesoriosScreen({ navigation }) {
    const [accesorios, setAccesorios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenToProducts('accesorios', (products) => {
            setAccesorios(products);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Accesorios</Text>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView style={styles.scrollContent}>
                    <TouchableOpacity style={styles.locationContainer}>
                        <MapPin size={16} color="#ff6b6b" />
                        <Text style={styles.locationText}>Aguascalientes</Text>
                    </TouchableOpacity>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#ff6b6b" />
                            <Text style={styles.loadingText}>Cargando productos...</Text>
                        </View>
                    ) : accesorios.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay productos disponibles</Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {accesorios.map((item) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    style={styles.card}
                                    onPress={() => navigation.navigate('ProductDetail', {
                                        product: item,
                                        category: 'Accesorios'
                                    })}
                                >
                                    <Image source={{ uri: item.image }} style={styles.image} alt={item.name} />
                                    <View style={styles.cardContent}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>{item.price}</Text>
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
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
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
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
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
        backgroundColor: "#f9f9f9",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    locationText: {
        fontSize: 15,
        color: "#333",
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
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
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
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 14,
        color: "#999",
    },
});
