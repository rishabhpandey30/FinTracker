import TransactionCard from "./TransactionCard";
import "../styles/cards.css";

const TransactionList = ({ transactions, onEdit, onAdd }) => {
    if (transactions.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                        <path d="M13 21l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        <rect x="13" y="13" width="8" height="8" rx="1" />
                    </svg>
                </div>
                <h3>No transactions found</h3>
                <p>Get started by recording your first income or expense.</p>
                {onAdd && (
                    <button className="empty-cta" onClick={onAdd}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Transaction
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="transaction-section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Transactions</h2>
                    <p className="section-subtitle">Your recent financial activity</p>
                </div>
                <span className="tx-count">{transactions.length} record{transactions.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="transaction-list">
                {transactions.map((tx) => (
                    <TransactionCard key={tx.id} transaction={tx} onEdit={onEdit} />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
