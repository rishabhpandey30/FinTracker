import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const EmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.displayName || !form.email || !form.password || !form.confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await register(form.email, form.password, form.displayName);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.code === "auth/email-already-in-use"
                    ? "Email already in use."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Brand Panel */}
            <div className="auth-brand-panel">
                <div className="brand-logo">
                    <div className="logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="logo-wordmark">Fin<span>Track</span></span>
                </div>

                <div className="brand-content">
                    <h2 className="brand-headline">
                        Start your<br />
                        <span className="highlight">financial journey.</span>
                    </h2>
                    <p className="brand-description">
                        Join thousands of users who track their income, expenses, and savings with FinTrack — completely free, forever.
                    </p>
                </div>

                <div className="brand-stats">
                    <div className="brand-stat">
                        <div className="brand-stat-value">∞</div>
                        <div className="brand-stat-label">Transactions</div>
                    </div>
                    <div className="brand-stat">
                        <div className="brand-stat-value">8+</div>
                        <div className="brand-stat-label">Categories</div>
                    </div>
                    <div className="brand-stat">
                        <div className="brand-stat-value">0₹</div>
                        <div className="brand-stat-label">Forever Free</div>
                    </div>
                </div>
            </div>

            {/* Form Panel */}
            <div className="auth-form-panel">
                <div className="auth-card">
                    {/* Mobile logo */}
                    <div className="auth-logo-mobile">
                        <div className="logo-mark" style={{ width: 32, height: 32, borderRadius: 9 }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18, color: "#fff" }}>
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)" }}>FinTrack</span>
                    </div>

                    <div className="auth-card-header">
                        <h1 className="auth-title">Create account</h1>
                        <p className="auth-subtitle">Get started with your free FinTrack account today.</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <AlertIcon />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="displayName">Full Name</label>
                            <div className="input-wrap">
                                <span className="input-icon"><UserIcon /></span>
                                <input
                                    id="displayName"
                                    type="text"
                                    name="displayName"
                                    placeholder="John Doe"
                                    value={form.displayName}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <div className="input-wrap">
                                <span className="input-icon"><EmailIcon /></span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrap">
                                <span className="input-icon"><LockIcon /></span>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrap">
                                <span className="input-icon"><LockIcon /></span>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                            </div>
                        </div>
                        <div className="auth-submit">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <span className="spinner" /> : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
