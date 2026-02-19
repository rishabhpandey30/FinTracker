import { useTransactions } from "../context/TransactionContext";
import "../styles/cards.css";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const BalanceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const IncomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const ExpenseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
    </svg>
);

const SummaryCards = () => {
    const { balance, totals } = useTransactions();

    const savingsRate = totals.income > 0
        ? Math.round(((totals.income - totals.expense) / totals.income) * 100)
        : 0;

    const cards = [
        {
            id: "balance",
            label: "Net Balance",
            value: balance,
            Icon: BalanceIcon,
            colorClass: "card-balance",
            trend: `${savingsRate}% savings rate`,
            barWidth: "100%",
        },
        {
            id: "income",
            label: "Total Income",
            value: totals.income,
            Icon: IncomeIcon,
            colorClass: "card-income",
            trend: `${totals.income > 0 ? "+" : ""}${formatCurrency(totals.income)}`,
            barWidth: totals.income > 0
                ? `${Math.min((totals.income / (totals.income + totals.expense)) * 100, 100)}%`
                : "0%",
        },
        {
            id: "expense",
            label: "Total Expenses",
            value: totals.expense,
            Icon: ExpenseIcon,
            colorClass: "card-expense",
            trend: totals.income > 0
                ? `${Math.round((totals.expense / totals.income) * 100)}% of income`
                : "No income yet",
            barWidth: totals.income > 0
                ? `${Math.min((totals.expense / (totals.income + totals.expense)) * 100, 100)}%`
                : "0%",
        },
    ];

    return (
        <div className="summary-grid">
            {cards.map((card) => (
                <div key={card.id} className={`summary-card ${card.colorClass}`}>
                    <div className="card-top">
                        <span className="card-label">{card.label}</span>
                        <span className="card-icon-wrap">
                            <card.Icon />
                        </span>
                    </div>
                    <div className="card-amount">
                        {card.id === "expense" && totals.expense > 0 ? "−" : ""}
                        {formatCurrency(Math.abs(card.value))}
                    </div>
                    <div className="card-footer">
                        <span className="card-trend">{card.trend}</span>
                        <div className="card-bar">
                            <div className="card-bar-fill" style={{ width: card.barWidth }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
