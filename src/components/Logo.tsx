export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <circle cx="32" cy="32" r="30" fill="#04122a" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="29" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="32" cy="30" rx="20" ry="6" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(-18 32 30)" />
      <path d="M10 47 Q32 36 54 47" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
