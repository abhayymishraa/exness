import { Link } from "react-router-dom";
import { PiArrowUpRight } from "react-icons/pi";

/**
 * Primary call to action. The trailing arrow never sits naked beside the label:
 * it lives in its own recessed disc flush with the button's inner padding, and
 * drifts diagonally on hover so the button has internal kinetic tension rather
 * than a flat colour swap.
 */
export default function Cta({
  to,
  children,
  variant = "primary",
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const primary = variant === "primary";
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-3 py-2 pl-6 pr-2 text-[15px] font-medium transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${
        primary
          ? "bg-accent text-[#04121f] hover:bg-accent-hot"
          : "border border-line-strong text-ink-dim hover:border-accent hover:text-ink"
      }`}
    >
      {children}
      <span
        aria-hidden
        className={`grid h-8 w-8 place-items-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[2px] ${
          primary ? "bg-[#04121f]/12" : "bg-raised"
        }`}
      >
        <PiArrowUpRight size={15} />
      </span>
    </Link>
  );
}
