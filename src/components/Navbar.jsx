import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/navbar.css";

const Navbar = ({ onAddClick }) => {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initials = currentUser?.displayName
        ? currentUser.displayName.charAt(0).toUpperCase()
        : currentUser?.email?.charAt(0).toUpperCase() || "U";

    const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";

    return (
        <>
            {/* ── Mobile Header ── */}
            <header className="mobile-header">
                <Link to="/dashboard" className="sidebar-logo">
                    <div className="logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="logo-wordmark">Fin<span>Track</span></span>
                </Link>
                <button className="topbar-add-btn" onClick={onAddClick} aria-label="Add transaction">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add</span>
                </button>
            </header>

            {/* ── Sidebar ── */}
            <aside className="sidebar">

                {/* Logo */}
                <Link to="/dashboard" className="sidebar-logo">
                    <div className="logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="logo-wordmark">Fin<span>Track</span></span>
                </Link>

                {/* Nav Links */}
                <nav className="sidebar-nav">
                    <span className="nav-section-label">Main</span>

                    <Link to="/dashboard" className="sidebar-link active">
                        <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                    </Link>

                    <button className="sidebar-link sidebar-link-btn" onClick={onAddClick}>
                        <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add Transaction
                    </button>

                    <span className="nav-section-label" style={{ marginTop: "8px" }}>Analytics</span>

                    <div className="sidebar-link" style={{ opacity: 0.45, cursor: "default", userSelect: "none" }}>
                        <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        Reports
                        <span className="sidebar-soon-badge">Soon</span>
                    </div>

                    <div className="sidebar-link" style={{ opacity: 0.45, cursor: "default", userSelect: "none" }}>
                        <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                        </svg>
                        Budgets
                        <span className="sidebar-soon-badge">Soon</span>
                    </div>
                </nav>

                {/* ── Footer — always visible, no dropdown ── */}
                <div className="sidebar-footer">

                    {/* User info card */}
                    <div className="sidebar-user-card">
                        <span className="sidebar-avatar">{initials}</span>
                        <div className="sidebar-user-info">
                            <p className="sidebar-user-name">{displayName}</p>
                            <p className="sidebar-user-email">{currentUser?.email}</p>
                        </div>
                    </div>

                    {/* Action row */}
                    <div className="sidebar-footer-actions">
                        {/* Theme toggle */}
                        <button
                            className="sidebar-footer-btn"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            aria-label="Toggle theme"
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
                            {theme === "dark" ? "Light" : "Dark"} Mode
                        </button>

                        {/* Sign out */}
                        <button
                            className="sidebar-footer-btn sidebar-signout-btn"
                            onClick={handleLogout}
                            aria-label="Sign out"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Navbar;
