import "../styles/dashboard.css";

const FloatingAddButton = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick} aria-label="Add transaction" title="Add Transaction">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </button>
    );
};

export default FloatingAddButton;
