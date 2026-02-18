import "../styles/dashboard.css";

const FloatingAddButton = ({ onClick }) => {
    return (
        <button className="fab" onClick={onClick} aria-label="Add transaction" title="Add Transaction">
            <span className="fab-icon">+</span>
        </button>
    );
};

export default FloatingAddButton;
