import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const getTransactionsRef = (userId) =>
    collection(db, "users", userId, "transactions");

export const addTransaction = async (userId, transaction) => {
    const ref = getTransactionsRef(userId);
    const docRef = await addDoc(ref, {
        ...transaction,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getTransactions = async (userId) => {
    const ref = getTransactionsRef(userId);
    const q = query(ref, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTransaction = async (userId, transactionId, data) => {
    const ref = doc(db, "users", userId, "transactions", transactionId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const deleteTransaction = async (userId, transactionId) => {
    const ref = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(ref);
};
