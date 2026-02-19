import { useState, useMemo } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    BarChart, Bar, LineChart, Line, ReferenceLine,
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

const formatShortSigned = (v) => {
    const abs = Math.abs(v);
    const prefix = v < 0 ? "-₹" : "₹";
    if (abs >= 100000) return `${prefix}${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${prefix}${(abs / 1000).toFixed(0)}k`;
    return `${prefix}${abs}`;
};

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            {label && <p className="chart-tooltip-label">{label}</p>}
            {payload.map((entry, i) => (
                <div key={i} className="chart-tooltip-row">
                    <span className="chart-tooltip-dot" style={{ background: entry.color || entry.fill }} />
                    <span className="chart-tooltip-name">{entry.name}:</span>
                    <span className="chart-tooltip-value">{formatINR(Math.abs(entry.value))}</span>
                </div>
            ))}
        </div>
    );
};

/* ── Pie Legend ── */
const PieLegend = ({ data, total }) => (
    <div className="pie-legend">
        {data.map((item, i) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
                <div key={i} className="pie-legend-row">
                    <span className="pie-legend-dot" style={{ background: PALETTE[i % PALETTE.length].color }} />
                    <span className="pie-legend-name">{item.name}</span>
                    <span className="pie-legend-pct">{pct}%</span>
                    <span className="pie-legend-val">{formatShort(item.value)}</span>
                </div>
            );
        })}
    </div>
);

/* ── Timeframe Selector ── */
const TIMEFRAMES = [
    { label: "3M", months: 3 },
    { label: "6M", months: 6 },
    { label: "12M", months: 12 },
];

/* ── Tab icons ── */
const BarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="10" width="4" height="11" rx="1" />
        <rect x="10" y="4" width="4" height="17" rx="1" />
        <rect x="17" y="7" width="4" height="14" rx="1" />
    </svg>
);
const AreaIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
const PieIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);
const TrendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const CHART_TABS = [
    { id: "area", label: "Cash Flow", Icon: AreaIcon },
    { id: "bar", label: "Monthly Bar", Icon: BarIcon },
    { id: "donut", label: "Breakdown", Icon: PieIcon },
    { id: "savings", label: "Net Flow", Icon: TrendIcon },
];

const Charts = ({ transactions }) => {
    const [activeSegment, setActiveSegment] = useState(null);
    const [activeTab, setActiveTab] = useState("area");
    const [timeframe, setTimeframe] = useState(6);

    /* ── Monthly data ── */
    const monthlyData = useMemo(() => {
        const map = transactions.reduce((acc, tx) => {
            if (!tx.date) return acc;
            const month = tx.date.slice(0, 7);
            if (!acc[month]) acc[month] = { month, Income: 0, Expense: 0 };
            if (tx.category === "Income") acc[month].Income += Number(tx.amount);
            else acc[month].Expense += Number(tx.amount);
            return acc;
        }, {});
        return Object.values(map)
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-timeframe)
            .map((d) => ({
                ...d,
                Net: d.Income - d.Expense,
                label: new Date(d.month + "-01").toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                }),
            }));
    }, [transactions, timeframe]);

    /* ── Savings rate data ── */
    const savingsData = useMemo(() =>
        monthlyData.map((d) => ({
            ...d,
            SavingsRate: d.Income > 0 ? Math.round(((d.Income - d.Expense) / d.Income) * 100) : 0,
        })), [monthlyData]);

    /* ── Pie data ── */
    const { pieData, totalExpense } = useMemo(() => {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - timeframe);
        const expenseMap = transactions
            .filter((tx) => tx.category !== "Income" && tx.date && new Date(tx.date) >= cutoff)
            .reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
                return acc;
            }, {});
        const pieData = Object.entries(expenseMap)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({ name, value }));
        return { pieData, totalExpense: pieData.reduce((s, d) => s + d.value, 0) };
    }, [transactions, timeframe]);

    /* ── Summary stats for the header ── */
    const totalIncome = monthlyData.reduce((s, d) => s + d.Income, 0);
    const totalNet = totalIncome - totalExpense;
    const avgSavings =
        monthlyData.length > 0
            ? Math.round((savingsData.reduce((s, d) => s + d.SavingsRate, 0) / monthlyData.length))
            : 0;

    if (transactions.length === 0) return null;

    const EmptyState = ({ msg }) => (
        <div className="chart-empty">
            <div className="chart-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                </svg>
            </div>
            <p>Not enough data</p>
            <span>{msg}</span>
        </div>
    );

    return (
        <div className="charts-section">
            {/* ── Section Header ── */}
            <div className="charts-section-header">
                <div>
                    <h2 className="charts-title">Analytics</h2>
                    <p className="charts-subtitle-text">Visualize your financial patterns</p>
                </div>
                <div className="charts-header-controls">
                    {/* Timeframe */}
                    <div className="charts-timeframe-pills">
                        {TIMEFRAMES.map((tf) => (
                            <button
                                key={tf.months}
                                className={`timeframe-pill${timeframe === tf.months ? " active" : ""}`}
                                onClick={() => setTimeframe(tf.months)}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Summary mini-stats ── */}
            <div className="charts-mini-stats">
                <div className="charts-mini-stat">
                    <span className="mini-stat-label">Total Income</span>
                    <span className="mini-stat-value income">{formatShort(totalIncome)}</span>
                </div>
                <div className="charts-mini-stat">
                    <span className="mini-stat-label">Total Expenses</span>
                    <span className="mini-stat-value expense">{formatShort(totalExpense)}</span>
                </div>
                <div className={`charts-mini-stat`}>
                    <span className="mini-stat-label">Net Savings</span>
                    <span className={`mini-stat-value ${totalNet >= 0 ? "income" : "expense"}`}>
                        {formatShortSigned(totalNet)}
                    </span>
                </div>
                <div className="charts-mini-stat">
                    <span className="mini-stat-label">Avg Savings Rate</span>
                    <span className={`mini-stat-value ${avgSavings >= 0 ? "income" : "expense"}`}>{avgSavings}%</span>
                </div>
            </div>

            {/* ── Chart Tabs ── */}
            <div className="charts-tab-bar">
                {CHART_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`chart-tab-btn${activeTab === tab.id ? " active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.Icon />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Chart Card ── */}
            <div className="chart-card chart-card-full">

                {/* ════ Area Chart ════ */}
                {activeTab === "area" && (
                    <>
                        <div className="chart-card-header">
                            <div className="chart-card-title-wrap">
                                <div className="chart-type-icon"><AreaIcon /></div>
                                <div>
                                    <h3 className="chart-subtitle">Income vs Expenses</h3>
                                    <p className="chart-period">Monthly cash flow over last {timeframe} months</p>
                                </div>
                            </div>
                            <div className="chart-header-legend">
                                <span className="chart-legend-dot" style={{ background: "#10b981" }} />
                                <span className="chart-legend-text">Income</span>
                                <span className="chart-legend-dot" style={{ background: "#f43f5e" }} />
                                <span className="chart-legend-text">Expenses</span>
                            </div>
                        </div>
                        {monthlyData.length === 0 ? <EmptyState msg="Add transactions to see trends." /> : (
                            <div className="chart-body-area">
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} dy={6} />
                                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "Inter, sans-serif" }} tickFormatter={formatShort} axisLine={false} tickLine={false} width={50} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2.5} fill="url(#gIncome)" dot={false} activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2, fill: "var(--bg-card)" }} />
                                        <Area type="monotone" dataKey="Expense" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gExpense)" dot={false} activeDot={{ r: 5, stroke: "#f43f5e", strokeWidth: 2, fill: "var(--bg-card)" }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}

                {/* ════ Bar Chart ════ */}
                {activeTab === "bar" && (
                    <>
                        <div className="chart-card-header">
                            <div className="chart-card-title-wrap">
                                <div className="chart-type-icon"><BarIcon /></div>
                                <div>
                                    <h3 className="chart-subtitle">Monthly Comparison</h3>
                                    <p className="chart-period">Side-by-side income & expenses for {timeframe} months</p>
                                </div>
                            </div>
                            <div className="chart-header-legend">
                                <span className="chart-legend-dot" style={{ background: "#10b981" }} />
                                <span className="chart-legend-text">Income</span>
                                <span className="chart-legend-dot" style={{ background: "#f43f5e" }} />
                                <span className="chart-legend-text">Expenses</span>
                            </div>
                        </div>
                        {monthlyData.length === 0 ? <EmptyState msg="Add transactions to see monthly bars." /> : (
                            <div className="chart-body-area">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4} barCategoryGap="28%">
                                        <defs>
                                            <linearGradient id="barIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                                            </linearGradient>
                                            <linearGradient id="barExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#e11d48" stopOpacity={0.7} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} dy={6} />
                                        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "Inter, sans-serif" }} tickFormatter={formatShort} axisLine={false} tickLine={false} width={50} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--accent-light)", radius: 4 }} />
                                        <Bar dataKey="Income" fill="url(#barIncome)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                        <Bar dataKey="Expense" fill="url(#barExpense)" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}

                {/* ════ Donut Chart ════ */}
                {activeTab === "donut" && (
                    <>
                        <div className="chart-card-header">
                            <div className="chart-card-title-wrap">
                                <div className="chart-type-icon"><PieIcon /></div>
                                <div>
                                    <h3 className="chart-subtitle">Expense Breakdown</h3>
                                    <p className="chart-period">Spending by category — last {timeframe} months</p>
                                </div>
                            </div>
                            {totalExpense > 0 && (
                                <span className="chart-total-badge">{formatINR(totalExpense)}</span>
                            )}
                        </div>
                        {pieData.length === 0 ? <EmptyState msg="Add an expense to see the breakdown." /> : (
                            <div className="chart-body-donut chart-body-donut-wide">
                                <div className="donut-wrap">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={72}
                                                outerRadius={activeSegment !== null ? 105 : 100}
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
                                                        opacity={activeSegment === null || activeSegment === i ? 1 : 0.35}
                                                        style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                                                    />
                                                ))}
                                                <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
                                                    style={{ fontFamily: "Outfit, sans-serif", fontSize: "11px", fill: "var(--text-muted)" }}>
                                                    {activeSegment !== null ? pieData[activeSegment]?.name : "Total Spent"}
                                                </text>
                                                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle"
                                                    style={{ fontFamily: "Outfit, sans-serif", fontSize: "17px", fontWeight: 700, fill: "var(--text-primary)" }}>
                                                    {formatShort(activeSegment !== null ? pieData[activeSegment]?.value : totalExpense)}
                                                </text>
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <PieLegend data={pieData} total={totalExpense} />
                            </div>
                        )}
                    </>
                )}

                {/* ════ Net Flow / Savings Rate ════ */}
                {activeTab === "savings" && (
                    <>
                        <div className="chart-card-header">
                            <div className="chart-card-title-wrap">
                                <div className="chart-type-icon"><TrendIcon /></div>
                                <div>
                                    <h3 className="chart-subtitle">Net Flow & Savings Rate</h3>
                                    <p className="chart-period">Monthly net savings across {timeframe} months</p>
                                </div>
                            </div>
                            <div className="chart-header-legend">
                                <span className="chart-legend-dot" style={{ background: "#7c3aed" }} />
                                <span className="chart-legend-text">Net</span>
                                <span className="chart-legend-dot" style={{ background: "#f59e0b" }} />
                                <span className="chart-legend-text">Rate %</span>
                            </div>
                        </div>
                        {savingsData.length === 0 ? <EmptyState msg="Add transactions to track savings." /> : (
                            <div className="chart-body-area">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={savingsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
                                                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter, sans-serif" }} axisLine={false} tickLine={false} dy={6} />
                                        <YAxis yAxisId="left" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "Inter, sans-serif" }} tickFormatter={formatShortSigned} axisLine={false} tickLine={false} width={54} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "Inter, sans-serif" }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} width={40} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <ReferenceLine yAxisId="left" y={0} stroke="var(--border-2)" strokeDasharray="4 4" />
                                        <Line yAxisId="left" type="monotone" dataKey="Net" name="Net Savings" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#7c3aed", stroke: "var(--bg-card)", strokeWidth: 2 }} />
                                        <Line yAxisId="right" type="monotone" dataKey="SavingsRate" name="Savings Rate" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#f59e0b", stroke: "var(--bg-card)", strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default Charts;
