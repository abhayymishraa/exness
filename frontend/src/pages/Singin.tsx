import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitsignin } from "../api/trade";
import AuthShell from "../components/AuthShell";
import AuthForm, { type AuthValues } from "../components/AuthForm";

export default function Signin() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }: AuthValues) => {
    setError("");
    const data = await submitsignin(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/trading");
    } else {
      setError(data.message ?? "We couldn't sign you in. Check your details.");
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Pick up where you left off."
      footer={
        <>
          No account yet?{" "}
          <Link
            to="/signup"
            className="text-accent transition-colors hover:text-accent-hot"
          >
            Open one
          </Link>
        </>
      }
    >
      <AuthForm
        submitLabel="Sign in"
        pendingLabel="Signing in…"
        serverError={error}
        onSubmit={handleSubmit}
      />
    </AuthShell>
  );
}
