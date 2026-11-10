import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../api";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const resetPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit reset code sent to your email."),
  newPassword: z.string().min(8, "Password must be at least 8 characters long."),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: initialEmail, code: "", newPassword: "" },
    mode: "onTouched",
  });

  async function submit(values: ResetPasswordValues) {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      const result = await apiRequest<{ message: string }>(
        "/auth/reset-password",
        {
        method: "POST",
          body: JSON.stringify(values),
        }
      );

      setMessage(result.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not reset password"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout single-auth">
      <form className="auth-card" onSubmit={handleSubmit(submit)} noValidate>
        <p className="eyebrow">ACCOUNT RECOVERY</p>
        <h2>Reset password</h2>
        <p className="muted">
          Enter your email, the code from your email, and a new password.
        </p>
        {error && <div className="error-message">{error}</div>}
        {message && (
          <div className="success-message">
            {message} <Link to="/login">Log in</Link>
          </div>
        )}
        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "reset-email-error" : undefined}
            {...register("email")}
          />
          {fieldErrors.email && (
            <small id="reset-email-error" className="field-error">
              {fieldErrors.email.message}
            </small>
          )}
        </label>
        <label>
          Reset code
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-invalid={Boolean(fieldErrors.code)}
            aria-describedby={fieldErrors.code ? "reset-code-error" : undefined}
            {...register("code")}
          />
          {fieldErrors.code && (
            <small id="reset-code-error" className="field-error">
              {fieldErrors.code.message}
            </small>
          )}
        </label>
        <label>
          New password
          <input
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(fieldErrors.newPassword)}
            aria-describedby={
              fieldErrors.newPassword ? "reset-password-error" : undefined
            }
            {...register("newPassword")}
          />
          {fieldErrors.newPassword && (
            <small id="reset-password-error" className="field-error">
              {fieldErrors.newPassword.message}
            </small>
          )}
        </label>
        <button className="btn btn-primary full-width" disabled={busy}>
          {busy ? "Resetting..." : "Reset password"}
        </button>
        <p className="auth-foot">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </section>
  );
}
