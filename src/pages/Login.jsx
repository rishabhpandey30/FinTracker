import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

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
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">FinTrack</span>
                </div>
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
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
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
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
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : "Sign In"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
