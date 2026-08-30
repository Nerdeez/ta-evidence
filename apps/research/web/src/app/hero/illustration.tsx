export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 400"
      width={560}
      height={400}
      role="img"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="hero-trend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.35" />
        </linearGradient>
        <clipPath id="hero-lens-clip">
          <circle cx="368" cy="168" r="62" />
        </clipPath>
      </defs>

      <path
        d="M 32 268 C 120 248, 168 292, 232 248 S 352 168, 420 128"
        fill="none"
        stroke="url(#hero-trend-gradient)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 32 268 C 120 248, 168 292, 232 248 S 352 168, 420 128"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />

      <g stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
        <line x1="52" y1="248" x2="52" y2="228" />
        <rect x="44" y="228" width="16" height="28" rx="2" fill="var(--primary)" stroke="none" />

        <line x1="84" y1="236" x2="84" y2="210" />
        <rect x="76" y="210" width="16" height="34" rx="2" fill="var(--primary)" stroke="none" />

        <line x1="212" y1="252" x2="212" y2="232" />
        <rect x="204" y="232" width="16" height="30" rx="2" fill="var(--primary)" stroke="none" />

        <line x1="244" y1="228" x2="244" y2="196" />
        <rect x="236" y="196" width="16" height="44" rx="2" fill="var(--primary)" stroke="none" />

        <line x1="276" y1="212" x2="276" y2="172" />
        <rect x="268" y="172" width="16" height="52" rx="2" fill="var(--primary)" stroke="none" />

        <line x1="308" y1="196" x2="308" y2="164" />
        <rect x="300" y="164" width="16" height="40" rx="2" fill="var(--primary)" stroke="none" />

        <line x1="340" y1="180" x2="340" y2="140" />
        <rect x="332" y="140" width="16" height="52" rx="2" fill="var(--primary)" stroke="none" />
      </g>

      <g stroke="var(--loss)" strokeWidth="2.5" strokeLinecap="round">
        <line x1="116" y1="220" x2="116" y2="268" />
        <rect x="108" y="220" width="16" height="36" rx="2" fill="var(--loss)" stroke="none" />

        <line x1="148" y1="204" x2="148" y2="256" />
        <rect x="140" y="204" width="16" height="44" rx="2" fill="var(--loss)" stroke="none" />

        <line x1="180" y1="216" x2="180" y2="272" />
        <rect x="172" y="216" width="16" height="40" rx="2" fill="var(--loss)" stroke="none" />
      </g>

      <g clipPath="url(#hero-lens-clip)">
        <rect x="300" y="96" width="140" height="140" fill="var(--background)" opacity="0.6" />
        <g transform="translate(24, -8) scale(1.15)">
          <g stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round">
            <line x1="276" y1="212" x2="276" y2="172" />
            <rect
              x="268"
              y="172"
              width="16"
              height="52"
              rx="2"
              fill="var(--primary)"
              stroke="none"
            />

            <line x1="308" y1="196" x2="308" y2="164" />
            <rect
              x="300"
              y="164"
              width="16"
              height="40"
              rx="2"
              fill="var(--primary)"
              stroke="none"
            />

            <line x1="340" y1="180" x2="340" y2="140" />
            <rect
              x="332"
              y="140"
              width="16"
              height="52"
              rx="2"
              fill="var(--primary)"
              stroke="none"
            />
          </g>
        </g>
      </g>

      <circle cx="368" cy="168" r="62" fill="none" stroke="var(--foreground)" strokeWidth="10" />
      <circle
        cx="368"
        cy="168"
        r="54"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="2"
        opacity="0.35"
      />
      <line
        x1="412"
        y1="212"
        x2="468"
        y2="268"
        stroke="var(--foreground)"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}
