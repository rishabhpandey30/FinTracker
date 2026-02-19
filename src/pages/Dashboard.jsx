import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import Filters from "../components/Filters";
import TransactionList from "../components/TransactionList";
import Charts from "../components/Charts";
import TransactionModal from "../components/TransactionModal";
import FloatingAddButton from "../components/FloatingAddButton";
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/dashboard.css";

const Dashboard = () => {
    const { transactions } = useTransactions();
    const { theme, toggleTheme } = useTheme();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        category: "All",
        dateFrom: "",
        dateTo: "",
    });

    const openAddModal = () => {
        setEditingTx(null);
        setModalOpen(true);
    };

    const openEditModal = (tx) => {
        setEditingTx(tx);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingTx(null);
    };

    const filteredTransactions = transactions.filter((tx) => {
        const matchSearch = tx.title
            .toLowerCase()
            .includes(filters.search.toLowerCase());
        const matchCategory =
            filters.category === "All" || tx.category === filters.category;
        const txDate = tx.date;
        const matchFrom = filters.dateFrom ? txDate >= filters.dateFrom : true;
        const matchTo = filters.dateTo ? txDate <= filters.dateTo : true;
        return matchSearch && matchCategory && matchFrom && matchTo;
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="dashboard-page">
            {/* Sidebar + Mobile Header */}
            <Navbar onAddClick={openAddModal} />

            {/* Main Content Area */}
            <div className="dashboard-content">
                {/* Top Bar */}
                <div className="topbar">
                    <div className="topbar-left">
                        <span className="topbar-badge">Beta</span>
                    </div>
                    <div className="topbar-right">
                        <button
                            className="topbar-icon-btn"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {theme === "dark" ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>
                        <button className="topbar-add-btn" onClick={openAddModal}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>New Transaction</span>
                        </button>
                    </div>
                </div>

                {/* Scrollable main */}
                <main className="dashboard-main">
                    <div className="dashboard-header">
                        <div>
                            <p className="dashboard-greeting">Welcome back 👋</p>
                            <h1 className="dashboard-title">
                                Financial <span>Overview</span>
                            </h1>
                            <p className="dashboard-subtitle">
                                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} tracked
                            </p>
                        </div>
                        <span className="header-date">{dateStr}</span>
                    </div>

                    <SummaryCards />
                    <Charts transactions={transactions} />
                    <Filters filters={filters} setFilters={setFilters} />
                    <TransactionList
                        transactions={filteredTransactions}
                        onEdit={openEditModal}
                        onAdd={openAddModal}
                    />
                </main>
            </div>

            {/* Mobile FAB */}
            <FloatingAddButton onClick={openAddModal} />

            {modalOpen && (
                <TransactionModal
                    onClose={closeModal}
                    editingTx={editingTx}
                />
            )}
        </div>
    );
};

export default Dashboard;
