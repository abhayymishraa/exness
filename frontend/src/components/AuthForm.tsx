import { useState } from "react";

export type AuthValues = { email: string; password: string };

/**
 * Email + password form with real client-side validation. The old version
 * returned silently on an empty field, so the button just did nothing —
 * indistinguishable from a broken app.
 */
export default function AuthForm({
  submitLabel,
  pendingLabel,
  serverError,
  onSubmit,
}: {
  submitLabel: string;
  pendingLabel: string;
  serverError?: string;
  onSubmit: (values: AuthValues) => Promise<void>;
}) {
  const [errors, setErrors] = useState<Partial<AuthValues>>({});
  const [pending, setPending] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("mail") ?? "").trim();
    const password = String(form.get("pass") ?? "");

    const next: Partial<AuthValues> = {};
    if (!email) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That doesn't look like an email address.";
    if (!password) next.password = "Enter your password.";
    else if (password.length < 8)
      next.password = "Passwords are at least 8 characters.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      await onSubmit({ email, password });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handle} noValidate className="space-y-5">
      <div>
        <label htmlFor="mail" className="label mb-2 block">
          Email
        </label>
        <input
          id="mail"
          name="mail"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "mail-error" : undefined}
          className="field px-3.5 py-3 text-[15px]"
        />
        {errors.email && (
          <p id="mail-error" className="mt-2 text-[13px] text-short">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="pass" className="label mb-2 block">
          Password
        </label>
        <input
          id="pass"
          name="pass"
          type="password"
          autoComplete="current-password"
          placeholder="At least 8 characters"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "pass-error" : undefined}
          className="field px-3.5 py-3 text-[15px]"
        />
        {errors.password && (
          <p id="pass-error" className="mt-2 text-[13px] text-short">
            {errors.password}
          </p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="border-l-2 border-short bg-short/8 px-3.5 py-2.5 text-[13px] text-short"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full py-3 text-[15px]"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
