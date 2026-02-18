import TransactionCard from "./TransactionCard";
import "../styles/cards.css";

const TransactionList = ({ transactions, onEdit }) => {
    if (transactions.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No transactions found</h3>
                <p>Add your first transaction using the + button below.</p>
            </div>
        );
    }

    return (
        <div className="transaction-section">
            <div className="section-header">
                <h2>Transactions</h2>
                <span className="tx-count">{transactions.length} records</span>
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
