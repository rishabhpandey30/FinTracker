import { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import "../styles/charts.css";

const PALETTE = [
    { color: "#7c3aed", bg: "rgba(124,58,237,0.15)" },
    { color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    { color: "#f43f5e", bg: "rgba(244,63,94,0.15)" },
    { color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    { color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
    { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
    { color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
    { color: "#4f46e5", bg: "rgba(79,70,229,0.15)" },
];

const formatINR = (v) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(v);

const formatShort = (v) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${v}`;
};

/* ── Custom Donut Centre Label ── */
const DonutCentreLabel = ({ cx, cy, total }) => (
    <>
        <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            style={{ fontFamily: "Outfit, sans-serif", fontSize: "11px", fill: "var(--text-muted)" }}
        >
            Total Spent
        </text>
        <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            style={{ fontFamily: "Outfit, sans-serif", fontSize: "17px", fontWeight: 700, fill: "var(--text-primary)" }}
        >
            {formatShort(total)}
        </text>
    </>
);

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            {label && <p className="chart-tooltip-label">{label}</p>}
            {payload.map((entry, i) => (
                <div key={i} className="chart-tooltip-row">
                    <span className="chart-tooltip-dot" style={{ background: entry.color }} />
                    <span className="chart-tooltip-name">{entry.name}:</span>
                    <span className="chart-tooltip-value">{formatINR(entry.value)}</span>
                </div>
            ))}
        </div>
    );
};

/* ── Custom Pie Legend ── */
const PieLegend = ({ data, total }) => (
    <div className="pie-legend">
        {data.map((item, i) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
                <div key={i} className="pie-legend-row">
                    <span
                        className="pie-legend-dot"
                        style={{ background: PALETTE[i % PALETTE.length].color }}
                    />
                    <span className="pie-legend-name">{item.name}</span>
                    <span className="pie-legend-pct">{pct}%</span>
                    <span className="pie-legend-val">{formatShort(item.value)}</span>
                </div>
            );
        })}
    </div>
);

/* ── Custom Area Legend ── */
const AreaLegend = () => (
    <div className="area-legend">
        <div className="area-legend-item">
            <span className="area-legend-line" style={{ background: "#10b981" }} />
            Income
        </div>
        <div className="area-legend-item">
            <span className="area-legend-line" style={{ background: "#f43f5e" }} />
            Expenses
        </div>
    </div>
);

/* ── Pie Icon ── */
const PieIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);

/* ── Area Icon ── */
const AreaIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const Charts = ({ transactions }) => {
    const [activeSegment, setActiveSegment] = useState(null);

    /* ── Prepare pie data ── */
    const expenseMap = transactions
        .filter((tx) => tx.category !== "Income")
        .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
            return acc;
        }, {});
    const pieData = Object.entries(expenseMap)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }));
    const totalExpense = pieData.reduce((s, d) => s + d.value, 0);

    /* ── Prepare area data (last 6 months) ── */
    const monthlyMap = transactions.reduce((acc, tx) => {
        if (!tx.date) return acc;
        const month = tx.date.slice(0, 7);
        if (!acc[month]) acc[month] = { month, Income: 0, Expense: 0 };
        if (tx.category === "Income") acc[month].Income += Number(tx.amount);
        else acc[month].Expense += Number(tx.amount);
        return acc;
    }, {});
    const areaData = Object.values(monthlyMap)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6)
        .map((d) => ({
            ...d,
            label: new Date(d.month + "-01").toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
            }),
        }));

    if (transactions.length === 0) return null;

    return (
        <div className="charts-section">
            <div className="charts-section-header">
                <div>
                    <h2 className="charts-title">Analytics</h2>
                    <p className="charts-subtitle-text">Visualize your financial patterns</p>
                </div>
                <span className="charts-badge">Last 6 months</span>
            </div>

            <div className="charts-grid">
                {/* ════ Donut Chart ════ */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div className="chart-card-title-wrap">
                            <div className="chart-type-icon">
                                <PieIcon />
                            </div>
                            <div>
                                <h3 className="chart-subtitle">Expense Breakdown</h3>
                                <p className="chart-period">Spending by category</p>
                            </div>
                        </div>
                        {totalExpense > 0 && (
                            <span className="chart-total-badge">{formatINR(totalExpense)}</span>
                        )}
                    </div>

                    {pieData.length === 0 ? (
                        <div className="chart-empty">
                            <div className="chart-empty-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                            </div>
                            <p>No expense data yet.</p>
                            <span>Add an expense to see the breakdown.</span>
                        </div>
                    ) : (
                        <div className="chart-body-donut">
                            <div className="donut-wrap">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={68}
                                            outerRadius={activeSegment !== null ? 100 : 96}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                            onMouseEnter={(_, i) => setActiveSegment(i)}
                                            onMouseLeave={() => setActiveSegment(null)}
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={PALETTE[i % PALETTE.length].color}
                                                    opacity={activeSegment === null || activeSegment === i ? 1 : 0.45}
                                                    style={{ cursor: "pointer", transition: "opacity 0.2s, transform 0.2s" }}
                                                />
                                            ))}
                                            {/* Centre label rendered inside SVG */}
                                            <text
                                                x="50%"
                                                y="45%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                style={{ fontFamily: "Outfit, sans-serif", fontSize: "11px", fill: "var(--text-muted)" }}
                                            >
                                                Total Spent
                                            </text>
                                            <text
                                                x="50%"
                                                y="57%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                style={{ fontFamily: "Outfit, sans-serif", fontSize: "16px", fontWeight: 700, fill: "var(--text-primary)" }}
                                            >
                                                {formatShort(totalExpense)}
                                            </text>
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <PieLegend data={pieData} total={totalExpense} />
                        </div>
                    )}
                </div>

                {/* ════ Area Chart ════ */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div className="chart-card-title-wrap">
                            <div className="chart-type-icon">
                                <AreaIcon />
                            </div>
                            <div>
                                <h3 className="chart-subtitle">Income vs Expenses</h3>
                                <p className="chart-period">Monthly flow trend</p>
                            </div>
                        </div>
                        <div className="chart-header-legend">
                            <span className="chart-legend-dot" style={{ background: "#10b981" }} />
                            <span className="chart-legend-text">In</span>
                            <span className="chart-legend-dot" style={{ background: "#f43f5e" }} />
                            <span className="chart-legend-text">Out</span>
                        </div>
                    </div>

                    {areaData.length === 0 ? (
                        <div className="chart-empty">
                            <div className="chart-empty-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                            </div>
                            <p>No data yet.</p>
                            <span>Add transactions to see trends.</span>
                        </div>
                    ) : (
                        <div className="chart-body-area">
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={areaData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{
                                            fill: "var(--text-muted)",
                                            fontSize: 11,
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={6}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: "var(--text-muted)",
                                            fontSize: 10,
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                        tickFormatter={formatShort}
                                        axisLine={false}
                                        tickLine={false}
                                        width={44}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="Income"
                                        stroke="#10b981"
                                        strokeWidth={2.5}
                                        fill="url(#gIncome)"
                                        dot={false}
                                        activeDot={{
                                            r: 5,
                                            stroke: "#10b981",
                                            strokeWidth: 2,
                                            fill: "var(--bg-card)",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Expense"
                                        stroke="#f43f5e"
                                        strokeWidth={2.5}
                                        fill="url(#gExpense)"
                                        dot={false}
                                        activeDot={{
                                            r: 5,
                                            stroke: "#f43f5e",
                                            strokeWidth: 2,
                                            fill: "var(--bg-card)",
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Charts;
