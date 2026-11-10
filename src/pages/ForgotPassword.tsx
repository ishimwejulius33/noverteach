import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { z } from "zod";


const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  async function submit({ email }: ForgotPasswordValues) {
    setError("");
    setMessage("");
    setBusy(true);

    try {
      await apiRequest<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not request reset code"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout single-auth">
      <form className="auth-card" onSubmit={handleSubmit(submit)} noValidate>
        <p className="eyebrow">ACCOUNT RECOVERY</p>
        <h2>Forgot password?</h2>
        <p className="muted">
          Enter your email address to request a reset code.
        </p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "forgot-email-error" : undefined}
            {...register("email")}
          />
          {fieldErrors.email && (
            <small id="forgot-email-error" className="field-error">
              {fieldErrors.email.message}
            </small>
          )}
        </label>

        <button
          className="btn btn-primary full-width"
          disabled={busy}
        >
          {busy ? "Sending..." : "Send reset code"}
        </button>

        <p className="auth-foot">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </section>
  );
}