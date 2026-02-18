import { useTransactions } from "../context/TransactionContext";
import "../styles/cards.css";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);

const SummaryCards = () => {
    const { balance, totals } = useTransactions();

    const cards = [
        {
            id: "balance",
            label: "Total Balance",
            value: balance,
            icon: "💳",
            colorClass: "card-balance",
            prefix: balance >= 0 ? "+" : "",
        },
        {
            id: "income",
            label: "Total Income",
            value: totals.income,
            icon: "📈",
            colorClass: "card-income",
            prefix: "+",
        },
        {
            id: "expense",
            label: "Total Expenses",
            value: totals.expense,
            icon: "📉",
            colorClass: "card-expense",
            prefix: "-",
        },
    ];

    return (
        <div className="summary-grid">
            {cards.map((card) => (
                <div key={card.id} className={`summary-card ${card.colorClass}`}>
                    <div className="card-top">
                        <span className="card-label">{card.label}</span>
                        <span className="card-icon-wrap">{card.icon}</span>
                    </div>
                    <div className="card-amount">
                        {card.id === "expense" && totals.expense > 0 ? "-" : ""}
                        {formatCurrency(Math.abs(card.value))}
                    </div>
                    <div className="card-bar">
                        <div
                            className="card-bar-fill"
                            style={{
                                width:
                                    card.id === "balance"
                                        ? "100%"
                                        : totals.income > 0
                                            ? `${Math.min(
                                                (card.value / (totals.income + totals.expense)) * 100,
                                                100
                                            )}%`
                                            : "0%",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
