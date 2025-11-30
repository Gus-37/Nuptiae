import { ref, onValue, push, remove, set, update, get } from 'firebase/database';
import { database } from '../config/firebaseConfig';

// Helpers para convertir snapshot a array
const snapshotToArray = (snapshot) => {
  const val = snapshot.val();
  if (!val) return [];
  return Object.keys(val).map((key) => ({ id: key, ...val[key] }));
};

export const subscribeToItems = (uid, callback) => {
  if (!uid) return () => {};
  const itemsRef = ref(database, `users/${uid}/presupuestos/items`);
  const unsub = onValue(itemsRef, (snap) => {
    callback(snapshotToArray(snap));
  }, (err) => {
    console.error('subscribeToItems error', err);
  });
  // onValue returns an unsubscribe function in the modular SDK
  return unsub;
};

export const subscribeToBudgetItems = (uid, callback) => {
  if (!uid) return () => {};
  const bRef = ref(database, `users/${uid}/presupuestos/budgetItems`);
  const unsub = onValue(bRef, (snap) => {
    callback(snapshotToArray(snap));
  }, (err) => {
    console.error('subscribeToBudgetItems error', err);
  });
  return unsub;
};

export const subscribeToMeta = (uid, callback) => {
  if (!uid) return () => {};
  const metaRef = ref(database, `users/${uid}/presupuestos/meta`);
  const unsub = onValue(metaRef, (snap) => {
    callback(snap.val() || {});
  }, (err) => {
    console.error('subscribeToMeta error', err);
  });
  return unsub;
};

export const addBudgetItem = async (uid, item) => {
  const listRef = ref(database, `users/${uid}/presupuestos/budgetItems`);
  const newRef = await push(listRef, item);
  return { success: true, id: newRef.key };
};

export const removeBudgetItem = async (uid, id) => {
  try {
    await remove(ref(database, `users/${uid}/presupuestos/budgetItems/${id}`));
    return { success: true };
  } catch (error) {
    console.error('removeBudgetItem error', error);
    return { success: false, error: error.message };
  }
};

export const addItem = async (uid, item) => {
  const listRef = ref(database, `users/${uid}/presupuestos/items`);
  const newRef = await push(listRef, item);
  return { success: true, id: newRef.key };
};

export const removeItem = async (uid, id) => {
  try {
    await remove(ref(database, `users/${uid}/presupuestos/items/${id}`));
    return { success: true };
  } catch (error) {
    console.error('removeItem error', error);
    return { success: false, error: error.message };
  }
};

export const updateItem = async (uid, id, fields) => {
  try {
    await update(ref(database, `users/${uid}/presupuestos/items/${id}`), fields);
    return { success: true };
  } catch (error) {
    console.error('updateItem error', error);
    return { success: false, error: error.message };
  }
};

export const updateMeta = async (uid, meta) => {
  try {
    await update(ref(database, `users/${uid}/presupuestos/meta`), meta);
    return { success: true };
  } catch (error) {
    console.error('updateMeta error', error);
    return { success: false, error: error.message };
  }
};

export const getInitialData = async (uid) => {
  try {
    const snapshot = await get(ref(database, `users/${uid}/presupuestos`));
    const val = snapshot.val() || {};
    return {
      items: val.items ? Object.keys(val.items).map(k => ({ id: k, ...val.items[k] })) : [],
      budgetItems: val.budgetItems ? Object.keys(val.budgetItems).map(k => ({ id: k, ...val.budgetItems[k] })) : [],
      meta: val.meta || {}
    };
  } catch (error) {
    console.error('getInitialData error', error);
    return { items: [], budgetItems: [], meta: {} };
  }
};

// ---- Shared account variants: store/read under sharedAccounts/{code}/costos to allow multiple users to share the same data ----
const snapshotToArrayVal = (val) => {
  if (!val) return [];
  return Object.keys(val).map((key) => ({ id: key, ...val[key] }));
};

export const getInitialDataForAccount = async (accountCode) => {
  try {
    const snapshot = await get(ref(database, `sharedAccounts/${accountCode}/costos`));
    const val = snapshot.val() || {};
    return {
      items: val.items ? Object.keys(val.items).map(k => ({ id: k, ...val.items[k] })) : [],
      budgetItems: val.budgetItems ? Object.keys(val.budgetItems).map(k => ({ id: k, ...val.budgetItems[k] })) : [],
      meta: val.meta || {}
    };
  } catch (error) {
    console.error('getInitialDataForAccount error', error);
    return { items: [], budgetItems: [], meta: {} };
  }
};

export const subscribeToItemsForAccount = (accountCode, callback) => {
  if (!accountCode) return () => {};
  const itemsRef = ref(database, `sharedAccounts/${accountCode}/costos/items`);
  const unsub = onValue(itemsRef, (snap) => {
    callback(snapshotToArray(snap));
  }, (err) => {
    console.error('subscribeToItemsForAccount error', err);
  });
  return unsub;
};

export const subscribeToBudgetItemsForAccount = (accountCode, callback) => {
  if (!accountCode) return () => {};
  const bRef = ref(database, `sharedAccounts/${accountCode}/costos/budgetItems`);
  const unsub = onValue(bRef, (snap) => {
    callback(snapshotToArray(snap));
  }, (err) => {
    console.error('subscribeToBudgetItemsForAccount error', err);
  });
  return unsub;
};

export const subscribeToMetaForAccount = (accountCode, callback) => {
  if (!accountCode) return () => {};
  const metaRef = ref(database, `sharedAccounts/${accountCode}/costos/meta`);
  const unsub = onValue(metaRef, (snap) => {
    callback(snap.val() || {});
  }, (err) => {
    console.error('subscribeToMetaForAccount error', err);
  });
  return unsub;
};

export const addBudgetItemToAccount = async (accountCode, item) => {
  const listRef = ref(database, `sharedAccounts/${accountCode}/costos/budgetItems`);
  const newRef = await push(listRef, item);
  return { success: true, id: newRef.key };
};

export const removeBudgetItemFromAccount = async (accountCode, id) => {
  try {
    await remove(ref(database, `sharedAccounts/${accountCode}/costos/budgetItems/${id}`));
    return { success: true };
  } catch (error) {
    console.error('removeBudgetItemFromAccount error', error);
    return { success: false, error: error.message };
  }
};

export const addItemToAccount = async (accountCode, item) => {
  const listRef = ref(database, `sharedAccounts/${accountCode}/costos/items`);
  const newRef = await push(listRef, item);
  return { success: true, id: newRef.key };
};

export const removeItemFromAccount = async (accountCode, id) => {
  try {
    await remove(ref(database, `sharedAccounts/${accountCode}/costos/items/${id}`));
    return { success: true };
  } catch (error) {
    console.error('removeItemFromAccount error', error);
    return { success: false, error: error.message };
  }
};

export const updateItemForAccount = async (accountCode, id, fields) => {
  try {
    await update(ref(database, `sharedAccounts/${accountCode}/costos/items/${id}`), fields);
    return { success: true };
  } catch (error) {
    console.error('updateItemForAccount error', error);
    return { success: false, error: error.message };
  }
};

export const updateMetaForAccount = async (accountCode, meta) => {
  try {
    await update(ref(database, `sharedAccounts/${accountCode}/costos/meta`), meta);
    return { success: true };
  } catch (error) {
    console.error('updateMetaForAccount error', error);
    return { success: false, error: error.message };
  }
};
