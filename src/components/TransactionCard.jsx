import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import "../styles/cards.css";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
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
                <span className="tx-icon">{icon}</span>
            </div>

            <div className="tx-info">
                <h4 className="tx-title">{transaction.title}</h4>
                <div className="tx-meta">
                    <span className={`tx-badge ${isIncome ? "badge-income" : "badge-expense"}`}>
                        {transaction.category}
                    </span>
                    <span className="tx-date">📅 {formattedDate}</span>
                </div>
            </div>

            <div className="tx-right">
                <span className={`tx-amount ${isIncome ? "amount-income" : "amount-expense"}`}>
                    {isIncome ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                </span>
                <div className="tx-actions">
                    <button
                        className="btn-edit"
                        onClick={() => onEdit(transaction)}
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        className={`btn-delete ${confirmDelete ? "btn-confirm" : ""}`}
                        onClick={handleDelete}
                        disabled={deleting}
                        title={confirmDelete ? "Click again to confirm" : "Delete"}
                    >
                        {deleting ? "..." : confirmDelete ? "✓ Confirm" : "🗑️"}
                    </button>
                    {confirmDelete && (
                        <button
                            className="btn-cancel"
                            onClick={() => setConfirmDelete(false)}
                            title="Cancel"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
