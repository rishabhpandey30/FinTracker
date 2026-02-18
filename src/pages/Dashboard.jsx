import { useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import Filters from "../components/Filters";
import TransactionList from "../components/TransactionList";
import Charts from "../components/Charts";
import TransactionModal from "../components/TransactionModal";
import FloatingAddButton from "../components/FloatingAddButton";
import { useTransactions } from "../context/TransactionContext";
import "../styles/dashboard.css";

const Dashboard = () => {
    const { transactions } = useTransactions();
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

    return (
        <div className="dashboard-page">
            <Navbar onAddClick={openAddModal} />
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Track your income and expenses</p>
                </div>
                <SummaryCards />
                <Charts transactions={transactions} />
                <Filters filters={filters} setFilters={setFilters} />
                <TransactionList
                    transactions={filteredTransactions}
                    onEdit={openEditModal}
                />
            </main>
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
