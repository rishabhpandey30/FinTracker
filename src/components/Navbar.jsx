import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/navbar.css";

const Navbar = ({ onAddClick }) => {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initials = currentUser?.displayName
        ? currentUser.displayName.charAt(0).toUpperCase()
        : currentUser?.email?.charAt(0).toUpperCase() || "U";

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Logo */}
                <Link to="/dashboard" className="navbar-logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">FinTrack</span>
                </Link>

                {/* Mobile hamburger */}
                <button
                    className="hamburger"
                    onClick={() => setMobileMenuOpen((p) => !p)}
                    aria-label="Toggle menu"
                >
                    <span className={`ham-line ${mobileMenuOpen ? "open" : ""}`} />
                    <span className={`ham-line ${mobileMenuOpen ? "open" : ""}`} />
                    <span className={`ham-line ${mobileMenuOpen ? "open" : ""}`} />
                </button>

                {/* Nav links */}
                <div className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
                    <Link
                        to="/dashboard"
                        className="nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="nav-icon">📊</span> Dashboard
                    </Link>
                    <button
                        className="nav-link nav-link-btn"
                        onClick={() => {
                            onAddClick();
                            setMobileMenuOpen(false);
                        }}
                    >
                        <span className="nav-icon">➕</span> Add Transaction
                    </button>
                </div>

                {/* Right section */}
                <div className="navbar-right">
                    {/* Theme toggle */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    {/* Profile dropdown */}
                    <div className="profile-wrapper" ref={dropdownRef}>
                        <button
                            className="profile-btn"
                            onClick={() => setDropdownOpen((p) => !p)}
                            aria-label="Profile menu"
                        >
                            <span className="avatar">{initials}</span>
                            <span className="profile-name">
                                {currentUser?.displayName || "User"}
                            </span>
                            <span className="chevron">{dropdownOpen ? "▲" : "▼"}</span>
                        </button>
                        {dropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-user">
                                    <span className="avatar avatar-lg">{initials}</span>
                                    <div>
                                        <p className="dropdown-name">
                                            {currentUser?.displayName || "User"}
                                        </p>
                                        <p className="dropdown-email">{currentUser?.email}</p>
                                    </div>
                                </div>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-logout" onClick={handleLogout}>
                                    🚪 Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
