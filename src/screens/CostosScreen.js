import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoreVertical, ShoppingCart, DollarSign, List, ArrowLeft, Calendar, Users, Home, Edit, Bold, Plus } from "lucide-react-native";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { getUserData } from '../services/authService';
import * as budgetService from '../services/budgetService';

export default function CostosScreen({ navigation, route }) {
  const [selectedTab, setSelectedTab] = useState("compras");
  const [menuVisible, setMenuVisible] = useState(false);
  const [budgetEditMode, setBudgetEditMode] = useState(false);
  // Presupuesto inicial sin definir
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [comprasTab, setComprasTab] = useState("enProceso");
  const [addBudgetItemVisible, setAddBudgetItemVisible] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetProvider, setNewBudgetProvider] = useState("");
  const [newBudgetPrice, setNewBudgetPrice] = useState("");
  const [editFocusActive, setEditFocusActive] = useState(false);
  const [items, setItems] = useState([]);

  const [budgetItems, setBudgetItems] = useState([]);
  const [uid, setUid] = useState(null);
  const [sharedCode, setSharedCode] = useState(null);
  const [meta, setMeta] = useState({});

  const removeItem = async (id) => {
    if (!uid && !sharedCode) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    if (sharedCode) {
      await budgetService.removeItemFromAccount(sharedCode, id);
    } else {
      await budgetService.removeItem(uid, id);
    }
  };

  const removeBudgetItem = async (id) => {
    if (!uid && !sharedCode) {
      setBudgetItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    if (sharedCode) {
      await budgetService.removeBudgetItemFromAccount(sharedCode, id);
    } else {
      await budgetService.removeBudgetItem(uid, id);
    }
  };

  const addBudgetItem = async () => {
    if (!newBudgetName.trim() || !newBudgetPrice.trim()) return;
    const itemToAdd = {
      name: newBudgetName,
      provider: newBudgetProvider || "Sin proveedor",
      price: newBudgetPrice.startsWith("$") ? newBudgetPrice : `$${newBudgetPrice}`,
      createdAt: new Date().toISOString(),
    };

    if (!uid) {
      // fallback local
      const newItem = { id: Math.max(...budgetItems.map(item => parseInt(item.id || 0)), 0) + 1, ...itemToAdd };
      setBudgetItems((prev) => [...prev, newItem]);
    } else {
      if (sharedCode) {
        await budgetService.addBudgetItemToAccount(sharedCode, itemToAdd);
      } else {
        await budgetService.addBudgetItem(uid, itemToAdd);
      }
    }

    setNewBudgetName("");
    setNewBudgetProvider("");
    setNewBudgetPrice("");
    setAddBudgetItemVisible(false);
  };

  // Función para parsear valores de moneda (ej: "$10,000" -> 10000)
  const parsePrice = (priceStr) => {
    return parseFloat(priceStr.replace(/[^0-9.-]/g, ''));
  };

  // Función para formatear números como moneda
  const formatPrice = (num) => {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calcular presupuesto mín y máx (manejar caso sin definir)
  const maxBudget = budgetMax ? parsePrice(`$${budgetMax}`) : NaN;
  const minBudget = budgetMin ? parsePrice(`$${budgetMin}`) : NaN;

  // Calcular gasto total por fuentes
  const cartTotal = items.reduce((sum, item) => sum + parsePrice(item.price), 0);
  const budgetTotal = budgetItems.reduce((sum, b) => sum + parsePrice(b.price), 0);
  // totalSpent = suma de ambos (para la lógica de presupuesto general)
  const totalSpent = cartTotal + budgetTotal;

  // Calcular presupuesto disponible (máximo menos gasto)
  const budgetRemaining = maxBudget - totalSpent;

  // Determinar estado del presupuesto
  const getBudgetStatus = () => {
    // Si no hay presupuesto definido
    if (!budgetMax) {
      return { status: 'unset', message: '¡Define el Presupuesto de tu Boda y Controla Cada Gasto!', color: '#666' };
    }
    const percentUsed = (totalSpent / maxBudget) * 100;
    if (totalSpent > maxBudget) {
      return { status: 'exceeded', message: 'Has excedido tu presupuesto', color: '#ff4444' };
    } else if (percentUsed >= 80) {
      return { status: 'warning', message: 'Te estás acercando a tu límite', color: '#ff9800' };
    } else {
      return { status: 'ok', message: 'Aún tienes presupuesto disponible', color: '#4caf50' };
    }
  };

  const budgetStatus = getBudgetStatus();

  // Pulse animation for the Edit icon when presupuesto is unset and user is on Presupuesto tab
  const editPulse = useRef(new Animated.Value(1)).current;
  const editGlowScale = useRef(new Animated.Value(1)).current;
  const editGlowOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let anim;
    if (selectedTab === 'presupuesto' && budgetStatus.status === 'unset' && editFocusActive) {
      anim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(editPulse, { toValue: 1.18, duration: 600, useNativeDriver: true }),
            Animated.timing(editPulse, { toValue: 1.0, duration: 600, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(editGlowScale, { toValue: 1.6, duration: 1200, useNativeDriver: true }),
            Animated.timing(editGlowScale, { toValue: 1.0, duration: 0, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(editGlowOpacity, { toValue: 0.36, duration: 600, useNativeDriver: true }),
            Animated.timing(editGlowOpacity, { toValue: 0.0, duration: 600, useNativeDriver: true }),
          ])
        ])
      );
      anim.start();
    } else {
      // reset
      editPulse.setValue(1);
      editGlowScale.setValue(1);
      editGlowOpacity.setValue(0);
      // also reset click flag when leaving the unset Presupuesto state
      if (!(selectedTab === 'presupuesto' && budgetStatus.status === 'unset')) {
        setEditFocusActive(false);
      }
    }
    return () => {
      if (anim && anim.stop) anim.stop();
    };
  }, [selectedTab, budgetStatus.status, editFocusActive]);

  // Recibir parámetros de navegación y establecer el tab correcto
  useEffect(() => {
    if (route.params?.tab) {
      setSelectedTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const subscriptionsRef = useRef([]);

  // Escuchar estado de autenticación y suscribirse a datos del usuario
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // cleanup any previous subscriptions (we won't await inside this listener repeatedly)
      if (subscriptionsRef.current && subscriptionsRef.current.length) {
        subscriptionsRef.current.forEach((u) => u && u());
        subscriptionsRef.current = [];
      }

      if (!user) {
        setUid(null);
        setSharedCode(null);
        setItems([]);
        setBudgetItems([]);
        setMeta({});
        return;
      }

      // For the signed-in user, fetch their profile to check if they belong to a shared account
      (async () => {
        try {
          setUid(user.uid);
          const ud = await getUserData(user.uid);
          const shared = ud && ud.data && ud.data.sharedAccountCode ? ud.data.sharedAccountCode : null;
          setSharedCode(shared);

          if (shared) {
            // shared account: load shared account data and subscribe to shared path
            const initial = await budgetService.getInitialDataForAccount(shared);
            if (initial.items) setItems(initial.items);
            if (initial.budgetItems) setBudgetItems(initial.budgetItems);
            if (initial.meta) {
              setMeta(initial.meta);
              if (initial.meta.budgetMax) setBudgetMax(String(initial.meta.budgetMax));
              if (initial.meta.budgetMin) setBudgetMin(String(initial.meta.budgetMin));
            }

            const unsubItems = budgetService.subscribeToItemsForAccount(shared, (list) => setItems(list));
            const unsubBudget = budgetService.subscribeToBudgetItemsForAccount(shared, (list) => setBudgetItems(list));
            const unsubMeta = budgetService.subscribeToMetaForAccount(shared, (m) => {
              setMeta(m || {});
              if (m?.budgetMax) setBudgetMax(String(m.budgetMax));
              if (m?.budgetMin) setBudgetMin(String(m.budgetMin));
            });

            subscriptionsRef.current = [unsubItems, unsubBudget, unsubMeta];
          } else {
            // personal account: operate under users/{uid}/costos
            const initial = await budgetService.getInitialData(user.uid);
            if (initial.items) setItems(initial.items);
            if (initial.budgetItems) setBudgetItems(initial.budgetItems);
            if (initial.meta) {
              setMeta(initial.meta);
              if (initial.meta.budgetMax) setBudgetMax(String(initial.meta.budgetMax));
              if (initial.meta.budgetMin) setBudgetMin(String(initial.meta.budgetMin));
            }

            const unsubItems = budgetService.subscribeToItems(user.uid, (list) => setItems(list));
            const unsubBudget = budgetService.subscribeToBudgetItems(user.uid, (list) => setBudgetItems(list));
            const unsubMeta = budgetService.subscribeToMeta(user.uid, (m) => {
              setMeta(m || {});
              if (m?.budgetMax) setBudgetMax(String(m.budgetMax));
              if (m?.budgetMin) setBudgetMin(String(m.budgetMin));
            });

            subscriptionsRef.current = [unsubItems, unsubBudget, unsubMeta];
          }
        } catch (err) {
          console.error('Error al inicializar datos de usuario shared:', err);
        }
      })();
    });

    return () => {
      unsubAuth && unsubAuth();
      if (subscriptionsRef.current && subscriptionsRef.current.length) {
        subscriptionsRef.current.forEach((u) => u && u());
        subscriptionsRef.current = [];
      }
    };
  }, []);

  // Filtrar items para la vista de Compras según el sub-tab seleccionado
  const comprasFiltered = items.filter((item) => {
    const s = (item.status || '').toLowerCase();
    if (comprasTab === 'entregados') {
      // Tratar como entregados los que contienen 'llegó' o 'entregado'
      return s.includes('llegó') || s.includes('entregado');
    }
    // Excluir items reservados de la vista 'en proceso'
    if (s.includes('reserv')) return false;
    // En proceso: resto de items
    return !(s.includes('llegó') || s.includes('entregado'));
  });

  // Extraer mes del texto de estado (ej: "Llegó el 15 de Septiembre 10:40 am" -> "Septiembre")
  const extractMonth = (statusText) => {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const lower = (statusText || '').toLowerCase();
    for (const month of months) {
      if (lower.includes(month)) return month.charAt(0).toUpperCase() + month.slice(1);
    }
    return 'Sin fecha';
  };

  // Agrupar items entregados por mes
  const groupByMonth = (filteredItems) => {
    const grouped = {};
    filteredItems.forEach((item) => {
      const month = extractMonth(item.status);
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(item);
    });
    return grouped;
  };

  const entregadosByMonth = comprasTab === 'entregados' ? groupByMonth(comprasFiltered) : {};

  

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => { if (navigation && navigation.canGoBack && navigation.canGoBack()) navigation.goBack(); }}>
            <ArrowLeft size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Costos y presupuesto</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => setMenuVisible(true)}>
            <MoreVertical size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSelectedTab("compras");
                  setMenuVisible(false);
                }}
              >
                <ShoppingCart size={20} color="#333" />
                <Text style={styles.menuItemText}>Compras</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSelectedTab("carrito");
                  setMenuVisible(false);
                }}
              >
                <List size={20} color="#333" />
                <Text style={styles.menuItemText}>Carrito</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setSelectedTab("presupuesto");
                  setMenuVisible(false);
                }}
              >
                <DollarSign size={20} color="#333" />
                <Text style={styles.menuItemText}>Presupuesto</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tabs */}
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedTab === "compras" ? "Compras" : selectedTab === "carrito" ? "Carrito" : "Presupuesto Total y Lista de gastos"}
            </Text>

            {selectedTab === "presupuesto" ? (
              <>
                <Text style={styles.totalLabel}>Indica cuánto quieres gastar en total y quién se encargará de cada partida</Text>
                <View style={styles.budgetHeaderRange}>
                  {budgetEditMode ? (
                    <View style={styles.budgetEditContainer}>
                      <Text style={styles.budgetEditLabel}>$0,000</Text>
                      <Text style={styles.budgetEditLabel}> - $</Text>
                      <TextInput
                        style={styles.budgetEditInput}
                        value={budgetMax}
                        onChangeText={setBudgetMax}
                        placeholder="20,000"
                        keyboardType="numeric"
                        onBlur={async () => {
                          setBudgetEditMode(false);
                          try {
                            if (sharedCode) {
                              await budgetService.updateMetaForAccount(sharedCode, { budgetMax });
                            } else if (uid) {
                              await budgetService.updateMeta(uid, { budgetMax });
                            }
                          } catch (err) {
                            console.error('Error updating budgetMax meta', err);
                          }
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.budgetHeaderContainer}>
                      <Text style={styles.budgetHeaderText}>{budgetMax ? `$${budgetMin || '0,000'} - $${budgetMax}` : 'Sin definir'}</Text>
                      <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                        <Animated.View style={[styles.editGlow, { opacity: editGlowOpacity, transform: [{ scale: editGlowScale }] }]} />
                        <Animated.View style={{ transform: [{ scale: editPulse }] }}>
                          <TouchableOpacity onPress={() => { setBudgetEditMode(true); setEditFocusActive(false); }}>
                            <Edit size={20} color="#ff6b6b" />
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    </View>
                  )}

                </View>

                {budgetItems.map((item) => (
                  <View key={item.id} style={styles.budgetItemCard}>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeBudgetItem(item.id)}
                      accessibilityLabel={`Eliminar ${item.name}`}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                    <View style={styles.budgetItemContent}>
                      <Text style={styles.budgetItemName}>{item.name}</Text>
                      <Text style={styles.budgetItemProvider}>{item.provider}</Text>
                      <Text style={styles.budgetItemPrice}>{item.price}</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : selectedTab === "compras" ? (
              <>
                <View style={styles.comprasTabs}>
                  <TouchableOpacity
                    style={[styles.comprasTab, comprasTab === 'entregados' && styles.comprasTabActive]}
                    onPress={() => setComprasTab('entregados')}
                  >
                    <Text style={[styles.comprasTabText, comprasTab === 'entregados' && styles.comprasTabTextActive]}>Entregados</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.comprasTab, comprasTab === 'enProceso' && styles.comprasTabActive]}
                    onPress={() => setComprasTab('enProceso')}
                  >
                    <Text style={[styles.comprasTabText, comprasTab === 'enProceso' && styles.comprasTabTextActive]}>En proceso</Text>
                  </TouchableOpacity>
                </View>
                {comprasTab === 'entregados' ? (
                  Object.entries(entregadosByMonth).map(([month, monthItems]) => (
                    <View key={month}>
                      <Text style={styles.monthHeader}>{month}</Text>
                      {monthItems.map((item) => (
                        <View key={item.id} style={styles.purchaseCard}>
                          <View style={styles.purchaseLeft}>
                            <View style={styles.purchaseImage} />
                          </View>
                          <View style={styles.purchaseBody}>
                            <Text style={styles.purchaseTitle}>{item.name}</Text>
                            <Text style={styles.purchaseSubtitle}>{item.detail}</Text>
                            <Text style={[styles.purchaseStatus, { color: '#4caf50' }]}>{item.status}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))
                ) : (
                  comprasFiltered.map((item) => (
                    <View key={item.id} style={styles.purchaseCard}>
                      <View style={styles.purchaseLeft}>
                        <View style={styles.purchaseImage} />
                      </View>
                      <View style={styles.purchaseBody}>
                        <Text style={styles.purchaseTitle}>{item.name}</Text>
                        <Text style={styles.purchaseSubtitle}>{item.detail}</Text>
                        <Text style={[styles.purchaseStatus, { color: '#ff9800' }]}>{item.status}</Text>
                      </View>
                    </View>
                  ))
                )}
              </>
            ) : (
              items.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  {selectedTab !== "compras" && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                      accessibilityLabel={`Eliminar ${item.name}`}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.itemImage} />
                  <View style={styles.itemContent}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetail}>{item.detail}</Text>
                    {selectedTab === "carrito" && (
                      <Text style={styles.itemPriceInline}>{item.price}</Text>
                    )}
                  </View>
                  {selectedTab !== "carrito" && (
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  )}
                </View>
              ))
            )}

            {/* total container moved outside to be fixed */}
          </View>
        </ScrollView>

        {/* Fixed total / presupuesto box - stays visible while scrolling */}
        <View style={styles.fixedTotalContainer} pointerEvents="box-none">
          {
            (() => {
              const isBudgetUnset = !budgetMax || isNaN(maxBudget);
              if (selectedTab === "carrito") {
                return (
                  <>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={[styles.totalAmount, { color: budgetStatus.color }]}>{formatPrice(cartTotal)}</Text>
                    {budgetStatus.status === 'unset' ? (
                      <TouchableOpacity onPress={() => setSelectedTab('presupuesto')}>
                        <Text style={[styles.budgetStatusMessage, { color: '#ff6b6b', marginTop: 8 }, styles.budgetMessageCentered]}>{budgetStatus.message}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={[styles.budgetStatusMessage, { color: budgetStatus.color, marginTop: 8 }]}>{budgetStatus.message}</Text>
                    )}
                    {!isBudgetUnset && (
                      <Text style={[styles.budgetRangeInfo, { color: '#000' }]}>Disponible: ${budgetMax} | Gastado: {formatPrice(totalSpent)}</Text>
                    )}
                    {selectedTab === "carrito" && (
                            <TouchableOpacity
                              style={styles.finalizeButton}
                              onPress={async () => {
                                // Marcar items reservados como 'En proceso' (visible en Compras -> En proceso)
                                const reserved = items.filter(i => (i.status || '').toLowerCase().includes('reserv'));
                                if (!reserved.length) return;
                                try {
                                  if (!uid && !sharedCode) {
                                    // local fallback
                                    setItems(prev => prev.map(i => ((i.status||'').toLowerCase().includes('reserv')) ? { ...i, status: 'En proceso' } : i));
                                  } else {
                                    for (const it of reserved) {
                                      if (sharedCode) {
                                        await budgetService.updateItemForAccount(sharedCode, it.id, { status: 'En proceso' });
                                      } else {
                                        await budgetService.updateItem(uid, it.id, { status: 'En proceso' });
                                      }
                                    }
                                  }
                                } catch (err) {
                                  console.error('Error finalizing reserved items', err);
                                }
                              }}
                            >
                              <Text style={styles.finalizeButtonText}>Finalizar compra</Text>
                            </TouchableOpacity>
                    )}
                  </>
                );
              }

              if (selectedTab === "presupuesto") {
                return (
                  <>
                    {budgetStatus.status === 'unset' ? (
                      <TouchableOpacity onPress={() => setEditFocusActive(true)}>
                        <Text style={[styles.budgetStatusMessage, { color: budgetStatus.color }, styles.budgetMessageCentered]}>{budgetStatus.message}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={[styles.budgetStatusMessage, { color: budgetStatus.color }]}>{budgetStatus.message}</Text>
                    )}
                  </>
                );
              }

              // compras tab
              if (isBudgetUnset) {
                return (
                  <>
                    {budgetStatus.status === 'unset' ? (
                      <TouchableOpacity onPress={() => setSelectedTab('presupuesto')}>
                        <Text style={[styles.budgetStatusMessage, { color: budgetStatus.color }, styles.budgetMessageCentered]}>{budgetStatus.message}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={[styles.budgetStatusMessage, { color: budgetStatus.color }]}>{budgetStatus.message}</Text>
                    )}
                  </>
                );
              }

              return (
                <>
                  <Text style={styles.totalLabel}>Presupuesto disponible</Text>
                  <Text style={styles.totalAmount}>{formatPrice(budgetRemaining)}</Text>
                </>
              );
            })()
          }
        </View>

        {/* Modal para agregar presupuesto item */}
        <Modal
          visible={addBudgetItemVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAddBudgetItemVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setAddBudgetItemVisible(false)}
          >
            <View style={styles.addBudgetModalContent}>
              <Text style={styles.addBudgetModalTitle}>Agregar Presupuesto</Text>
              <TextInput
                style={styles.addBudgetInput}
                placeholder="Nombre del item"
                value={newBudgetName}
                onChangeText={setNewBudgetName}
              />
              <TextInput
                style={styles.addBudgetInput}
                placeholder="Proveedor"
                value={newBudgetProvider}
                onChangeText={setNewBudgetProvider}
              />
              <TextInput
                style={styles.addBudgetInput}
                placeholder="Precio (ej: $5,000)"
                value={newBudgetPrice}
                onChangeText={setNewBudgetPrice}
                keyboardType="numeric"
              />
              <View style={styles.addBudgetButtonGroup}>
                <TouchableOpacity
                  style={[styles.addBudgetButton, { backgroundColor: "#eee" }]}
                  onPress={() => setAddBudgetItemVisible(false)}
                >
                  <Text style={{ color: "#333", fontSize: 14, fontWeight: "600" }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addBudgetButton, { backgroundColor: "#ff6b6b" }]}
                  onPress={addBudgetItem}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>Agregar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* FAB para agregar presupuesto (solo visible en tab presupuesto) */}
        {selectedTab === "presupuesto" && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setAddBudgetItemVisible(true)}
          >
            <Plus size={28} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <Home size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Costos", { tab: "compras" })}
          >
            <ShoppingCart size={24} color="#ff6b6b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Agenda")}>
            <Calendar size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Cuentas")}>
            <Users size={24} color="#666" />
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    spacing: 0.5,
    flex: 1,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    color: "#333",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff6b6b",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  tabTextActive: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ff6b6b",
  },
  budgetStatusMessage: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  budgetRangeInfo: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  fixedTotalContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 60, // above bottom nav
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 20,
  },
  scrollContent: {
    paddingBottom: 220,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 24,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  removeButtonText: {
    fontSize: 14,
    color: "#ff6b6b",
    fontWeight: "700",
    lineHeight: 16,
  },
  itemPriceInline: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginTop: 6,
  },
  finalizeButton: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  finalizeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  budgetHeaderRange: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    alignItems: "center",
  },
  budgetHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  budgetHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  budgetEditInput: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    borderWidth: 1,
    borderColor: "#ff6b6b",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: "center",
    minWidth: 80,
  },
  budgetEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetEditLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  budgetItemCard: {
    backgroundColor: "#fff7f0",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: "#f2d8cc",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  budgetItemContent: {
    flex: 1,
  },
  budgetItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  budgetItemProvider: {
    fontSize: 14,
    color: "#555",
  },
  budgetItemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  comprasTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  comprasTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  comprasTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff6b6b',
  },
  comprasTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  comprasTabTextActive: {
    color: '#ff6b6b',
  },
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  purchaseLeft: {
    marginRight: 12,
  },
  purchaseImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9e9e9',
  },
  purchaseBody: {
    flex: 1,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  purchaseSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  purchaseStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
    paddingLeft: 4,
  },
  editGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6b6b',
    zIndex: 0,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  budgetMessageCentered: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 140,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  addBudgetModalContent: {
    backgroundColor: '#fff',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBudgetModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  addBudgetInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  addBudgetButtonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
  },
  addBudgetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});
