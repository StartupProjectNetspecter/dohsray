// Dohsray mark: a chat bubble holding a "D" and a check mark, meaning "problem solved".
// Same artwork as public/brand/logo.svg and the app icons.
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden>
      <path d="M26 8h48a18 18 0 0 1 18 18v40a18 18 0 0 1-18 18H34l-18 12 4-14A18 18 0 0 1 8 66V26A18 18 0 0 1 26 8z" fill="#2f5bff" />
      <g fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 31h5a15 15 0 0 1 0 30h-5z" />
        <path className="logo-check" d="M56 48L63 60L77 32" />
      </g>
    </svg>
  );
}
