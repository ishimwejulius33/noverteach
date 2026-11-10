import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your admin username or email."),
  password: z.string().min(1, "Enter your password."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  async function submit({ email, password }: LoginFormValues) {
    setError(""); setBusy(true);
    try {
      const user = await login(email, password);
      const next = new URLSearchParams(location.search).get("next");
      const from = (location.state as { from?: string } | null)?.from;
      navigate(user.role === "admin" ? "/admin" : next || from || "/products", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    } finally { setBusy(false); }
  }

  return <section className="auth-layout"><div className="auth-aside"><p className="eyebrow">WELCOME BACK</p><h1>Your next great tech find is waiting.</h1><p>Sign in to continue shopping with NovaTech.</p></div>
    <form className="auth-card" onSubmit={handleSubmit(submit)} noValidate><p className="eyebrow">YOUR ACCOUNT</p><h2>Log in</h2><p className="muted">Enter your account details below.</p>
      {error && <div className="error-message">{error}</div>}
      <label>Admin username or email<input type="text" autoComplete="username" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "login-email-error" : undefined} {...register("email")} />{fieldErrors.email && <small id="login-email-error" className="field-error">{fieldErrors.email.message}</small>}</label>
      <label>Password<input type="password" autoComplete="current-password" aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "login-password-error" : undefined} {...register("password")} />{fieldErrors.password && <small id="login-password-error" className="field-error">{fieldErrors.password.message}</small>}</label>
      <button className="btn btn-primary full-width" disabled={busy}>{busy ? "Signing in..." : "Log in"}</button>
      <p className="auth-foot">Don't have an account? <Link to="/register">Create one</Link></p>
      <p className="auth-foot"><Link to="/forgot-password">Forgot your password?</Link></p>
    </form>
  </section>;
}
