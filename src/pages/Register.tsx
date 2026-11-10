import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<RegistrationFormValues>({ resolver: zodResolver(registrationSchema) });

  async function submit({ name, email, password }: RegistrationFormValues) {
    setError(""); setBusy(true);
    try {
      const user = await register(name, email, password);
      navigate(user.role === "admin" ? "/admin" : "/products", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally { setBusy(false); }
  }

  return <section className="auth-layout"><div className="auth-aside"><p className="eyebrow">JOIN NOVATECH</p><h1>Good technology. Better possibilities.</h1><p>Create an account to shop and manage your shopping experience.</p></div>
    <form className="auth-card" onSubmit={handleSubmit(submit)} noValidate><p className="eyebrow">GET STARTED</p><h2>Create account</h2><p className="muted">Your account will be created as a customer.</p>
      {error && <div className="error-message">{error}</div>}
      <label>Full name<input autoComplete="name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "register-name-error" : undefined} {...registerField("name")} />{fieldErrors.name && <small id="register-name-error" className="field-error">{fieldErrors.name.message}</small>}</label>
      <label>Email address<input type="email" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "register-email-error" : undefined} {...registerField("email")} />{fieldErrors.email && <small id="register-email-error" className="field-error">{fieldErrors.email.message}</small>}</label>
      <label>Password<input type="password" autoComplete="new-password" aria-invalid={Boolean(fieldErrors.password)} aria-describedby={fieldErrors.password ? "register-password-error" : undefined} {...registerField("password")} /><small>Use at least 8 characters.</small>{fieldErrors.password && <small id="register-password-error" className="field-error">{fieldErrors.password.message}</small>}</label>
      <button className="btn btn-primary full-width" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button>
      <p className="auth-foot">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  </section>;
}
