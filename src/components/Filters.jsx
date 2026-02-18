import "../styles/filters.css";

const CATEGORIES = ["All", "Income", "Expense"];

const Filters = ({ filters, setFilters }) => {
    const handleChange = (e) =>
        setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const clearFilters = () =>
        setFilters({ search: "", category: "All", dateFrom: "", dateTo: "" });

    const hasActiveFilters =
        filters.search ||
        filters.category !== "All" ||
        filters.dateFrom ||
        filters.dateTo;

    return (
        <div className="filters-bar">
            <div className="filter-group">
                <span className="filter-icon">🔍</span>
                <input
                    type="text"
                    name="search"
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={handleChange}
                    className="filter-input"
                />
            </div>

            <div className="filter-group">
                <span className="filter-icon">🏷️</span>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="filter-select"
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <span className="filter-icon">📅</span>
                <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleChange}
                    className="filter-input filter-date"
                    title="From date"
                />
                <span className="filter-sep">→</span>
                <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleChange}
                    className="filter-input filter-date"
                    title="To date"
                />
            </div>

            {hasActiveFilters && (
                <button className="filter-clear" onClick={clearFilters}>
                    ✕ Clear
                </button>
            )}
        </div>
    );
};

export default Filters;
