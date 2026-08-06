import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitsignup } from "../api/trade";
import AuthShell from "../components/AuthShell";
import AuthForm, { type AuthValues } from "../components/AuthForm";

export default function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }: AuthValues) => {
    setError("");
    const data = await submitsignup(email, password);
    if (data.userId) {
      localStorage.setItem("userID", data.userId);
      navigate("/signin");
    } else {
      setError(
        data.message ?? "We couldn't create that account. Try another email.",
      );
    }
  };

  return (
    <AuthShell
      title="Open an account"
      subtitle="You'll start with a $5,000 demo balance."
      footer={
        <>
          Already have one?{" "}
          <Link
            to="/signin"
            className="text-accent transition-colors hover:text-accent-hot"
          >
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm
        submitLabel="Open account"
        pendingLabel="Creating account…"
        serverError={error}
        onSubmit={handleSubmit}
      />
    </AuthShell>
  );
}
