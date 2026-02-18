import { useState, useEffect } from "react";
import { useTransactions } from "../context/TransactionContext";
import "../styles/modal.css";

const CATEGORIES = [
    "Income",
    "Expense",
    "Food",
    "Transport",
    "Shopping",
    "Health",
    "Entertainment",
    "Utilities",
    "Other",
];

const defaultForm = {
    title: "",
    amount: "",
    category: "Expense",
    date: new Date().toISOString().split("T")[0],
};

const TransactionModal = ({ onClose, editingTx }) => {
    const { addTransaction, editTransaction } = useTransactions();
    const [form, setForm] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingTx) {
            setForm({
                title: editingTx.title,
                amount: String(editingTx.amount),
                category: editingTx.category,
                date: editingTx.date,
            });
        } else {
            setForm(defaultForm);
        }
    }, [editingTx]);

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

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-card">
                <div className="modal-header">
                    <h3>{editingTx ? "Edit Transaction" : "Add Transaction"}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-form-group">
                        <label htmlFor="m-title">Title</label>
                        <input
                            id="m-title"
                            type="text"
                            name="title"
                            placeholder="e.g. Salary, Groceries..."
                            value={form.title}
                            onChange={handleChange}
                        />
                        {errors.title && <span className="field-error">{errors.title}</span>}
                    </div>

                    <div className="modal-form-row">
                        <div className="modal-form-group">
                            <label htmlFor="m-amount">Amount (₹)</label>
                            <input
                                id="m-amount"
                                type="number"
                                name="amount"
                                placeholder="0.00"
                                min="0.01"
                                step="0.01"
                                value={form.amount}
                                onChange={handleChange}
                            />
                            {errors.amount && (
                                <span className="field-error">{errors.amount}</span>
                            )}
                        </div>

                        <div className="modal-form-group">
                            <label htmlFor="m-date">Date</label>
                            <input
                                id="m-date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                            {errors.date && <span className="field-error">{errors.date}</span>}
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label htmlFor="m-category">Category</label>
                        <select
                            id="m-category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <span className="field-error">{errors.category}</span>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="spinner" />
                            ) : editingTx ? (
                                "Save Changes"
                            ) : (
                                "Add Transaction"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
