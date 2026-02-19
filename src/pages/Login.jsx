import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

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

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.code === "auth/invalid-credential"
                    ? "Invalid email or password."
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
                        Your finances,<br />
                        <span className="highlight">crystal clear.</span>
                    </h2>
                    <p className="brand-description">
                        Track every rupee, visualize your spending habits, and make smarter money decisions — all in one elegant dashboard.
                    </p>
                </div>

                <div className="brand-stats">
                    <div className="brand-stat">
                        <div className="brand-stat-value">100%</div>
                        <div className="brand-stat-label">Secure & Private</div>
                    </div>
                    <div className="brand-stat">
                        <div className="brand-stat-value">Live</div>
                        <div className="brand-stat-label">Real-time Sync</div>
                    </div>
                    <div className="brand-stat">
                        <div className="brand-stat-value">Free</div>
                        <div className="brand-stat-label">Forever Plan</div>
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
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to your FinTrack account to continue.</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <AlertIcon />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
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
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>
                        <div className="auth-submit">
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? <span className="spinner" /> : "Sign In"}
                            </button>
                        </div>
                    </form>

                    <p className="auth-switch">
                        Don&apos;t have an account?{" "}
                        <Link to="/register">Create one free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
