import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import "../styles/charts.css";

const PIE_COLORS = [
    "#00c896",
    "#ff6b6b",
    "#ffd93d",
    "#6bcbff",
    "#a78bfa",
    "#fb923c",
    "#34d399",
    "#f472b6",
];

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

const Charts = ({ transactions }) => {
    // Pie chart: expense breakdown by category
    const expenseByCategory = transactions
        .filter((tx) => tx.category !== "Income")
        .reduce((acc, tx) => {
            const key = tx.category;
            acc[key] = (acc[key] || 0) + Number(tx.amount);
            return acc;
        }, {});

    const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
    }));

    // Bar chart: monthly income vs expense
    const monthlyData = transactions.reduce((acc, tx) => {
        if (!tx.date) return acc;
        const month = tx.date.slice(0, 7); // YYYY-MM
        if (!acc[month]) acc[month] = { month, Income: 0, Expense: 0 };
        if (tx.category === "Income") acc[month].Income += Number(tx.amount);
        else acc[month].Expense += Number(tx.amount);
        return acc;
    }, {});

    const barData = Object.values(monthlyData)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6)
        .map((d) => ({
            ...d,
            month: new Date(d.month + "-01").toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
            }),
        }));

    if (transactions.length === 0) return null;

    return (
        <div className="charts-section">
            <h2 className="charts-title">Analytics</h2>
            <div className="charts-grid">
                {/* Pie Chart */}
                <div className="chart-card">
                    <h3 className="chart-subtitle">Expense Breakdown</h3>
                    {pieData.length === 0 ? (
                        <div className="chart-empty">No expense data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Bar Chart */}
                <div className="chart-card">
                    <h3 className="chart-subtitle">Income vs Expense</h3>
                    {barData.length === 0 ? (
                        <div className="chart-empty">No data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={barData} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                                    tickFormatter={(v) => `₹${v / 1000}k`}
                                />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="Income" fill="#00c896" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expense" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Charts;
