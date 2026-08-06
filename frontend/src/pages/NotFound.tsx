import { Link } from "react-router-dom";

/**
 * Without a catch-all route, an unknown URL rendered a blank page — no error,
 * no way back.
 */
export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-base px-6 text-ink">
      <div aria-hidden className="grid-field pointer-events-none fixed inset-0" />
      <main className="relative text-center">
        <p className="num label">Error 404</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold">
          That page doesn't exist.
        </h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-[15px] text-ink-dim">
          The link may be out of date, or the address mistyped.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary px-5 py-2.5 text-sm">
            Back to home
          </Link>
          <Link to="/trading" className="btn btn-ghost px-5 py-2.5 text-sm">
            Open the terminal
          </Link>
        </div>
      </main>
    </div>
  );
}
