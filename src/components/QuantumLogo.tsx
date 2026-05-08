interface Props {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function QuantumLogo({ size = 64, showText = true, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Mark - DNA helix + lens/seed shape */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer glow ring */}
        <circle cx="32" cy="28" r="17" fill="none" stroke="url(#goldRing)" strokeWidth="1.5" opacity="0.4" />

        {/* Main gold seed/lens shape */}
        <ellipse cx="32" cy="28" rx="10" ry="16" fill="url(#goldBody)" />

        {/* Center vertical line */}
        <line x1="32" y1="13" x2="32" y2="43" stroke="#0a0a0a" strokeWidth="2" />

        {/* Horizontal dividers */}
        <line x1="24" y1="23" x2="40" y2="23" stroke="#0a0a0a" strokeWidth="1.2" />
        <line x1="24" y1="33" x2="40" y2="33" stroke="#0a0a0a" strokeWidth="1.2" />

        {/* Top point crown */}
        <path d="M32 10 L29 14 L32 12 L35 14 Z" fill="url(#goldBody)" />

        {/* DNA helix bottom */}
        <path
          d="M22 47 Q27 44 32 47 Q37 50 42 47"
          stroke="url(#greenGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
        <path
          d="M22 52 Q27 49 32 52 Q37 55 42 52"
          stroke="url(#greenGrad2)" strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
        <path
          d="M22 57 Q27 54 32 57 Q37 60 42 57"
          stroke="url(#greenGrad3)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"
        />

        {/* Vertical DNA lines */}
        <line x1="25" y1="45" x2="25" y2="58" stroke="#0d6249" strokeWidth="1.5" opacity="0.6" />
        <line x1="39" y1="45" x2="39" y2="58" stroke="#0d6249" strokeWidth="1.5" opacity="0.6" />

        <defs>
          <linearGradient id="goldBody" x1="22" y1="12" x2="42" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f0ca5a" />
            <stop offset="0.5" stopColor="#D4A847" />
            <stop offset="1" stopColor="#a3731a" />
          </linearGradient>
          <linearGradient id="goldRing" x1="15" y1="11" x2="49" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f0ca5a" />
            <stop offset="1" stopColor="#D4A847" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="22" y1="47" x2="42" y2="47" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d9e7a" />
            <stop offset="1" stopColor="#0d6249" />
          </linearGradient>
          <linearGradient id="greenGrad2" x1="22" y1="52" x2="42" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d8a6a" />
            <stop offset="1" stopColor="#0a4d3a" />
          </linearGradient>
          <linearGradient id="greenGrad3" x1="22" y1="57" x2="42" y2="57" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d6249" />
            <stop offset="1" stopColor="#083d2e" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-gold-gradient font-bold text-2xl tracking-wide">Quantum</span>
          <span className="text-gold-gradient font-bold text-2xl tracking-wide">Ceed</span>
        </div>
      )}
    </div>
  );
}
