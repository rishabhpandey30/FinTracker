import { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import "../styles/modal.css";

const INCOME_CATEGORIES = ["Income"];
const EXPENSE_CATEGORIES = ["Food", "Transport", "Shopping", "Health", "Entertainment", "Utilities", "Other"];

const defaultForm = {
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
};

const TitleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
    </svg>
);

const AmountIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const DateIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const CategoryIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const AddIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const EditSquareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TransactionModal = ({ onClose, editingTx }) => {
    const { addTransaction, editTransaction } = useTransactions();
    const [txType, setTxType] = useState("expense"); // "income" | "expense"
    const [form, setForm] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingTx) {
            const isIncome = editingTx.category === "Income";
            setTxType(isIncome ? "income" : "expense");
            setForm({
                title: editingTx.title,
                amount: String(editingTx.amount),
                category: editingTx.category,
                date: editingTx.date,
            });
        } else {
            setTxType("expense");
            setForm(defaultForm);
        }
    }, [editingTx]);

    // Update category when type changes
    useEffect(() => {
        if (!editingTx) {
            setForm((prev) => ({
                ...prev,
                category: txType === "income" ? "Income" : "Food",
            }));
        }
    }, [txType, editingTx]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = "Title is required.";
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
            errs.amount = "Enter a valid positive amount.";
        if (!form.category) errs.category = "Category is required.";
        if (!form.date) errs.date = "Date is required.";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        try {
            const data = {
                title: form.title.trim(),
                amount: parseFloat(form.amount),
                category: form.category,
                date: form.date,
            };
            if (editingTx) {
                await editTransaction(editingTx.id, data);
            } else {
                await addTransaction(data);
            }
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const categories = txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-card">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-header-icon">
                            {editingTx ? <EditSquareIcon /> : <AddIcon />}
                        </div>
                        <div>
                            <h3>{editingTx ? "Edit Transaction" : "New Transaction"}</h3>
                            <p>{editingTx ? "Update the details below" : "Record an income or expense"}</p>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Type Toggle (only for new transactions) */}
                {!editingTx && (
                    <div className="modal-type-toggle">
                        <button
                            type="button"
                            className={`type-option income ${txType === "income" ? "active" : ""}`}
                            onClick={() => setTxType("income")}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                <polyline points="17 6 23 6 23 12" />
                            </svg>
                            Income
                        </button>
                        <button
                            type="button"
                            className={`type-option expense ${txType === "expense" ? "active" : ""}`}
                            onClick={() => setTxType("expense")}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                                <polyline points="17 18 23 18 23 12" />
                            </svg>
                            Expense
                        </button>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Title */}
                    <div className="modal-form-group">
                        <label htmlFor="m-title">Title</label>
                        <div className="modal-input-wrap">
                            <span className="modal-input-icon"><TitleIcon /></span>
                            <input
                                id="m-title"
                                type="text"
                                name="title"
                                placeholder="e.g. Salary, Grocery run..."
                                value={form.title}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                        {errors.title && <span className="field-error">{errors.title}</span>}
                    </div>

                    <div className="modal-form-row">
                        {/* Amount */}
                        <div className="modal-form-group amount-field">
                            <label htmlFor="m-amount">Amount (₹)</label>
                            <div className="modal-input-wrap">
                                <span className="modal-input-icon"><AmountIcon /></span>
                                <input
                                    id="m-amount"
                                    type="number"
                                    name="amount"
                                    placeholder="0"
                                    min="0.01"
                                    step="0.01"
                                    value={form.amount}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.amount && <span className="field-error">{errors.amount}</span>}
                        </div>

                        {/* Date */}
                        <div className="modal-form-group">
                            <label htmlFor="m-date">Date</label>
                            <div className="modal-input-wrap">
                                <span className="modal-input-icon"><DateIcon /></span>
                                <input
                                    id="m-date"
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.date && <span className="field-error">{errors.date}</span>}
                        </div>
                    </div>

                    {/* Category */}
                    {!(txType === "income" && !editingTx) && (
                        <div className="modal-form-group">
                            <label htmlFor="m-category">Category</label>
                            <div className="modal-input-wrap">
                                <span className="modal-input-icon"><CategoryIcon /></span>
                                <select
                                    id="m-category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.category && <span className="field-error">{errors.category}</span>}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="spinner" />
                            ) : editingTx ? (
                                "Save Changes"
                            ) : txType === "income" ? (
                                "+ Add Income"
                            ) : (
                                "− Add Expense"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
