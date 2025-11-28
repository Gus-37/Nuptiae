import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";

export default function FotografiaScreen({ navigation }) {
    const { colors, fontScale, theme } = useUISettings();

    const fotografos = [
        {
            id: 1,
            name: "Fotografía #1",
            price: "$2,000",
            image: "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        {
            id: 2,
            name: "Fotografía #2",
            price: "$3,500",
            image: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        {
            id: 3,
            name: "Fotografía #3",
            price: "$2,500",
            image: "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
        {
            id: 4,
            name: "Fotografía #4",
            price: "$4,000",
            image: "https://images.pexels.com/photos/8422403/pexels-photo-8422403.jpeg?auto=compress&cs=tinysrgb&w=600",
        },
    ];

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

                    <View style={styles.grid}>
                        {fotografos.map((item) => (
                            <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: colors.card }]}>
                                <Image source={{ uri: item.image }} style={styles.image} alt={item.name} />
                                <View style={styles.cardContent}>
                                    <Text style={[styles.itemName, { color: colors.text, fontSize: 14 * fontScale }]}>{item.name}</Text>
                                    <Text style={[styles.itemPrice, { color: colors.muted, fontSize: 14 * fontScale }]}>{item.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
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
});
