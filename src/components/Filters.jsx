import "../styles/filters.css";

const CATEGORIES = ["All", "Income", "Food", "Transport", "Shopping", "Health", "Entertainment", "Utilities", "Other"];

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const TagIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
);

const CalendarIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

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
                <span className="filter-group-icon"><SearchIcon /></span>
                <input
                    type="text"
                    name="search"
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={handleChange}
                    className="filter-input"
                />
            </div>

            <div className="filter-group" style={{ minWidth: "140px", flex: "0 0 auto" }}>
                <span className="filter-group-icon"><TagIcon /></span>
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="filter-select"
                    style={{ paddingLeft: "32px" }}
                >
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group" style={{ flex: "0 0 auto" }}>
                <span className="filter-group-icon"><CalendarIcon /></span>
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
                    <XIcon />
                    Clear
                </button>
            )}
        </div>
    );
};

export default Filters;
