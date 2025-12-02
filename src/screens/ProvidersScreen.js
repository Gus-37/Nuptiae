import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, MapPin, ArrowLeft } from "lucide-react-native";
import { useUISettings } from "../context/UISettingsContext";

export default function ProvidersScreen({ navigation }) {
    const { colors, fontScale, theme } = useUISettings();
    const [menuVisible, setMenuVisible] = useState(false);
    const [layout, setLayout] = useState("vertical"); // 'vertical' o 'horizontal'

    const categories = [
        { id: 1, name: "Aguascalientes", icon: "📍", screen: null },
        { id: 2, name: "Fotografía y video", icon: "📷", screen: "Fotografia" },
        { id: 3, name: "Floristerías", icon: "🌸", screen: "Floristerias" },
        { id: 4, name: "Vestido de novia", icon: "👗", screen: "Vestidos" },
        { id: 5, name: "Traje de novio", icon: "🤵", screen: "Trajes" },
        { id: 6, name: "Accesorios", icon: "💍", screen: "Accesorios" },
    ];

    const popularProviders = [
        {
            id: 1,
            name: "Catedral Zaragoza",
            image: "https://images.pexels.com/photos/208208/pexels-photo-208208.jpeg?auto=compress&cs=tinysrgb&w=600",
            screen: "Catedrales",
        },
        {
            id: 2,
            name: "Hotel Trojes",
            image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
            screen: "Hoteles",
        },
        {
            id: 3,
            name: "Playa",
            image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600",
            screen: "Playas",
        },
    ];

    const accessories = [
        {
            id: 1,
            name: "Gemelos para novio",
            image: "https://images.pexels.com/photos/1839904/pexels-photo-1839904.jpeg?auto=compress&cs=tinysrgb&w=600",
            screen: "AccesoriosPersonalizados",
        },
        {
            id: 2,
            name: "Anillos para boda",
            image: "https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600",
            screen: "AccesoriosPersonalizados",
        },
    ];

    const MenuModal = () => (
        <Modal
            visible={menuVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setMenuVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setMenuVisible(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: colors.muted }]}>✕</Text>
                    </TouchableOpacity>

                    {categories.map((category) => (
                        <TouchableOpacity 
                            key={category.id} 
                            style={[styles.menuItem, { borderBottomColor: colors.border }]}
                            onPress={() => {
                                setMenuVisible(false);
                                if (category.screen) {
                                    navigation.navigate(category.screen);
                                }
                            }}
                        >
                            <Text style={styles.menuIcon}>{category.icon}</Text>
                            <Text style={[styles.menuText, { color: colors.text, fontSize: 16 * fontScale }]}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );

    const renderVerticalLayout = () => (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                {/* Custom Header */}
                <View style={[styles.customHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.customHeaderTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Proveedores</Text>
                    <TouchableOpacity 
                        onPress={() => setMenuVisible(true)}
                        style={styles.headerButton}
                    >
                        <Menu size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContent}>
                    {/* Location */}
                    <TouchableOpacity style={[styles.locationContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                        <MapPin size={16} color={colors.accent} />
                        <Text style={[styles.locationText, { color: colors.text, fontSize: 15 * fontScale }]}>Aguascalientes</Text>
                    </TouchableOpacity>

                    {/* Popular Section */}
                    <View style={[styles.section, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 20 * fontScale }]}>Más populares</Text>
                        <View style={styles.verticalGrid}>
                            {popularProviders.map((provider) => (
                                <TouchableOpacity 
                                    key={provider.id} 
                                    style={styles.verticalCard}
                                    onPress={() => provider.screen && navigation.navigate(provider.screen)}
                                >
                                    <Image source={{ uri: provider.image }} style={styles.verticalImage} alt={provider.name} />
                                    <Text style={[styles.cardTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{provider.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Accessories Section */}
                    <View style={[styles.section, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 20 * fontScale }]}>Accesorios personalizados</Text>
                        <View style={styles.verticalGrid}>
                            {accessories.map((item) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    style={styles.verticalCard}
                                    onPress={() => item.screen && navigation.navigate(item.screen)}
                                >
                                    <Image source={{ uri: item.image }} style={styles.verticalImage} alt={item.name} />
                                    <Text style={[styles.cardTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );

    const renderHorizontalLayout = () => (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={colors.bg} translucent={false} />
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                {/* Custom Header */}
                <View style={[styles.customHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.customHeaderTitle, { color: colors.text, fontSize: 18 * fontScale }]}>Proveedores</Text>
                    <TouchableOpacity 
                        onPress={() => setMenuVisible(true)}
                        style={styles.headerButton}
                    >
                        <Menu size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContent}>
                    {/* Location */}
                    <TouchableOpacity style={[styles.locationContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                        <MapPin size={16} color={colors.accent} />
                        <Text style={[styles.locationText, { color: colors.text, fontSize: 15 * fontScale }]}>Aguascalientes</Text>
                    </TouchableOpacity>

                    {/* Popular Section */}
                    <View style={[styles.section, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 20 * fontScale }]}>Más populares</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 16 }}
                        >
                            {popularProviders.map((provider) => (
                                <TouchableOpacity 
                                    key={provider.id} 
                                    style={styles.horizontalCard}
                                    onPress={() => provider.screen && navigation.navigate(provider.screen)}
                                >
                                    <Image source={{ uri: provider.image }} style={styles.horizontalImage} alt={provider.name} />
                                    <Text style={[styles.cardTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{provider.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Accessories Section */}
                    <View style={[styles.section, { backgroundColor: colors.bg }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 20 * fontScale }]}>Accesorios personalizados</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 16 }}
                        >
                            {accessories.map((item) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    style={styles.horizontalCard}
                                    onPress={() => item.screen && navigation.navigate(item.screen)}
                                >
                                    <Image source={{ uri: item.image }} style={styles.horizontalImage} alt={item.name} />
                                    <Text style={[styles.cardTitle, { color: colors.text, fontSize: 16 * fontScale }]}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );

    return (
        <View style={[styles.wrapper, { backgroundColor: colors.bg }]}>
            {layout === "vertical" ? renderVerticalLayout() : renderHorizontalLayout()}
            <MenuModal />
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
    },
    customHeader: {
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
    customHeaderTitle: {
        fontWeight: "600",
    },
    headerButton: {
        padding: 4,
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
    section: {
        paddingVertical: 20,
    },
    sectionTitle: {
        fontWeight: "700",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    // Vertical Layout Styles
    verticalGrid: {
        paddingHorizontal: 16,
    },
    verticalCard: {
        marginBottom: 20,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    verticalImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        backgroundColor: "#f0f0f0",
    },
    cardTitle: {
        fontWeight: "600",
        padding: 16,
    },
    // Horizontal Layout Styles
    horizontalCard: {
        width: 300,
        marginLeft: 16,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    horizontalImage: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
        backgroundColor: "#f0f0f0",
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 100,
    },
    modalContent: {
        borderRadius: 16,
        padding: 20,
        width: "85%",
        maxWidth: 400,
        maxHeight: "70%",
    },
    closeButton: {
        alignSelf: "flex-end",
        marginBottom: 12,
        padding: 4,
    },
    closeButtonText: {
        fontSize: 28,
        fontWeight: "300",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
        width: 30,
    },
    menuText: {
        fontWeight: "400",
    },
    // Toggle Button
    toggleButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    toggleButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
