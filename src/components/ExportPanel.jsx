import { useState } from "react";
import { useTransactions } from "../context/TransactionContext";
import "../styles/export.css";

const formatINR = (v) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(v);

/* ── Download helpers ── */
const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const exportCSV = (transactions) => {
    const headers = ["Date", "Title", "Category", "Type", "Amount (INR)", "Notes"];
    const rows = transactions.map((tx) => [
        tx.date,
        `"${tx.title.replace(/"/g, '""')}"`,
        tx.category,
        tx.category === "Income" ? "Income" : "Expense",
        tx.amount,
        `"${(tx.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadFile(csv, `fintrack-export-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
};

const exportJSON = (transactions) => {
    const data = transactions.map((tx) => ({
        date: tx.date,
        title: tx.title,
        category: tx.category,
        type: tx.category === "Income" ? "income" : "expense",
        amount: Number(tx.amount),
        notes: tx.notes || "",
    }));
    downloadFile(
        JSON.stringify({ exported_at: new Date().toISOString(), count: data.length, transactions: data }, null, 2),
        `fintrack-export-${new Date().toISOString().slice(0, 10)}.json`,
        "application/json"
    );
};

const EXPORT_RANGES = [
    { label: "All Time", value: "all" },
    { label: "This Month", value: "month" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "This Year", value: "year" },
];

const filterByRange = (transactions, range) => {
    const now = new Date();
    const cutoff = new Date();

    if (range === "all") return transactions;
    if (range === "month") {
        cutoff.setDate(1);
        cutoff.setHours(0, 0, 0, 0);
    } else if (range === "3m") {
        cutoff.setMonth(now.getMonth() - 3);
    } else if (range === "6m") {
        cutoff.setMonth(now.getMonth() - 6);
    } else if (range === "year") {
        cutoff.setMonth(0);
        cutoff.setDate(1);
        cutoff.setHours(0, 0, 0, 0);
    }

    return transactions.filter((tx) => tx.date && new Date(tx.date) >= cutoff);
};

const ExportPanel = () => {
    const { transactions, totals, balance } = useTransactions();
    const [range, setRange] = useState("all");
    const [exportedFormat, setExportedFormat] = useState(null);

    const filtered = filterByRange(transactions, range);

    const filteredTotals = filtered.reduce(
        (acc, tx) => {
            if (tx.category === "Income") acc.income += Number(tx.amount);
            else acc.expense += Number(tx.amount);
            return acc;
        },
        { income: 0, expense: 0 }
    );

    const handleExport = (format) => {
        if (format === "csv") exportCSV(filtered);
        if (format === "json") exportJSON(filtered);
        setExportedFormat(format.toUpperCase());
        setTimeout(() => setExportedFormat(null), 2500);
    };

    const topCategories = Object.entries(
        filtered
            .filter((tx) => tx.category !== "Income")
            .reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
                return acc;
            }, {})
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const savingsRate =
        filteredTotals.income > 0
            ? Math.max(0, Math.round(((filteredTotals.income - filteredTotals.expense) / filteredTotals.income) * 100))
            : 0;

    return (
        <div className="export-panel">
            <div className="export-panel-header">
                <div className="export-header-left">
                    <div className="export-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="export-title">Export & Insights</h2>
                        <p className="export-subtitle">Download your data or view snapshot</p>
                    </div>
                </div>
            </div>

            <div className="export-body">
                {/* ── Range Picker ── */}
                <div className="export-range-row">
                    <span className="export-range-label">Date Range</span>
                    <div className="export-range-pills">
                        {EXPORT_RANGES.map((r) => (
                            <button
                                key={r.value}
                                className={`export-range-pill${range === r.value ? " active" : ""}`}
                                onClick={() => setRange(r.value)}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Snapshot Stats ── */}
                <div className="export-stats-grid">
                    <div className="export-stat-card">
                        <span className="export-stat-label">Transactions</span>
                        <span className="export-stat-value">{filtered.length}</span>
                    </div>
                    <div className="export-stat-card income">
                        <span className="export-stat-label">Income</span>
                        <span className="export-stat-value">{formatINR(filteredTotals.income)}</span>
                    </div>
                    <div className="export-stat-card expense">
                        <span className="export-stat-label">Expenses</span>
                        <span className="export-stat-value">{formatINR(filteredTotals.expense)}</span>
                    </div>
                    <div className={`export-stat-card ${savingsRate >= 0 ? "savings" : "expense"}`}>
                        <span className="export-stat-label">Savings Rate</span>
                        <span className="export-stat-value">{savingsRate}%</span>
                    </div>
                </div>

                {/* ── Top Categories ── */}
                {topCategories.length > 0 && (
                    <div className="export-top-cats">
                        <span className="export-range-label">Top Expense Categories</span>
                        <div className="export-cat-list">
                            {topCategories.map(([cat, amt], i) => {
                                const pct =
                                    filteredTotals.expense > 0
                                        ? Math.round((amt / filteredTotals.expense) * 100)
                                        : 0;
                                return (
                                    <div key={cat} className="export-cat-row">
                                        <span className="export-cat-rank">#{i + 1}</span>
                                        <span className="export-cat-name">{cat}</span>
                                        <div className="export-cat-bar-wrap">
                                            <div
                                                className="export-cat-bar-fill"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="export-cat-pct">{pct}%</span>
                                        <span className="export-cat-amt">{formatINR(amt)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Export Buttons ── */}
                <div className="export-actions">
                    <div className="export-actions-label">
                        <span>Export {filtered.length} records</span>
                        {exportedFormat && (
                            <span className="export-success-badge">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {exportedFormat} downloaded!
                            </span>
                        )}
                    </div>
                    <div className="export-btn-row">
                        <button
                            className="export-btn csv"
                            onClick={() => handleExport("csv")}
                            disabled={filtered.length === 0}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="3" y1="15" x2="21" y2="15" />
                                <line x1="9" y1="3" x2="9" y2="21" />
                            </svg>
                            Export CSV
                        </button>

                        <button
                            className="export-btn json"
                            onClick={() => handleExport("json")}
                            disabled={filtered.length === 0}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                            Export JSON
                        </button>

                        <button
                            className="export-btn print"
                            onClick={() => window.print()}
                            disabled={filtered.length === 0}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            Print / PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportPanel;
