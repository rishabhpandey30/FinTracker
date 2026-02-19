import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import "../styles/cards.css";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const CATEGORY_ICONS = {
    Income: "💵",
    Expense: "💸",
    Food: "🍔",
    Transport: "🚗",
    Shopping: "🛍️",
    Health: "🏥",
    Entertainment: "🎬",
    Utilities: "💡",
    Other: "📦",
};

const EditIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const TransactionCard = ({ transaction, onEdit }) => {
    const { removeTransaction } = useTransactions();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isIncome = transaction.category === "Income";

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        setDeleting(true);
        await removeTransaction(transaction.id);
    };

    const icon = CATEGORY_ICONS[transaction.category] || "📦";

    const formattedDate = transaction.date
        ? new Date(transaction.date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

    return (
        <div className={`tx-card ${isIncome ? "tx-income" : "tx-expense"}`}>
            <div className="tx-icon-wrap">
                <span>{icon}</span>
            </div>

            <div className="tx-info">
                <h4 className="tx-title">{transaction.title}</h4>
                <div className="tx-meta">
                    <span className={`tx-badge ${isIncome ? "badge-income" : "badge-expense"}`}>
                        {transaction.category}
                    </span>
                    <span className="tx-date">{formattedDate}</span>
                </div>
            </div>

            <div className="tx-right">
                <span className={`tx-amount ${isIncome ? "amount-income" : "amount-expense"}`}>
                    {isIncome ? "+" : "−"}
                    {formatCurrency(Math.abs(transaction.amount))}
                </span>
                <div className="tx-actions">
                    <button
                        className="btn-edit"
                        onClick={() => onEdit(transaction)}
                        title="Edit"
                        aria-label="Edit transaction"
                    >
                        <EditIcon />
                    </button>
                    <button
                        className={`btn-delete ${confirmDelete ? "btn-confirm" : ""}`}
                        onClick={handleDelete}
                        disabled={deleting}
                        title={confirmDelete ? "Click again to confirm" : "Delete"}
                        aria-label="Delete transaction"
                    >
                        {deleting ? "…" : confirmDelete ? "Confirm?" : <TrashIcon />}
                    </button>
                    {confirmDelete && (
                        <button
                            className="btn-cancel"
                            onClick={() => setConfirmDelete(false)}
                            title="Cancel"
                            aria-label="Cancel delete"
                        >
                            <XIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
