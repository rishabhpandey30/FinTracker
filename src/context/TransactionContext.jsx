import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
    addTransaction as fbAdd,
    getTransactions as fbGet,
    updateTransaction as fbUpdate,
    deleteTransaction as fbDelete,
} from "../firebase/firestore";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await fbGet(currentUser.uid);
            setTransactions(data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (transaction) => {
        const id = await fbAdd(currentUser.uid, transaction);
        const newTx = { id, ...transaction, createdAt: { seconds: Date.now() / 1000 } };
        setTransactions((prev) => [newTx, ...prev]);
    };

    const editTransaction = async (id, data) => {
        await fbUpdate(currentUser.uid, id, data);
        setTransactions((prev) =>
            prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
        );
    };

    const removeTransaction = async (id) => {
        await fbDelete(currentUser.uid, id);
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    };

    const totals = transactions.reduce(
        (acc, tx) => {
            if (tx.category === "Income") acc.income += Number(tx.amount);
            else acc.expense += Number(tx.amount);
            return acc;
        },
        { income: 0, expense: 0 }
    );

    const balance = totals.income - totals.expense;

    const value = {
        transactions,
        loading,
        addTransaction,
        editTransaction,
        removeTransaction,
        totals,
        balance,
        fetchTransactions,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};
