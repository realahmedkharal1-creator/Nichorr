"use client";

export type OAuthProvider = "google";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.92a9 9 0 0 0 0 8.1l3.05-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .92 4.95l3.05 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

const PROVIDERS: { id: OAuthProvider; label: string; Icon: () => JSX.Element }[] = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
];

export function SocialAuthButtons({
  onSelect,
  disabled = false,
}: {
  onSelect: (provider: OAuthProvider) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {PROVIDERS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2.5 bg-card border border-line hover:bg-paper hover:border-muted-2 text-ink py-[11px] px-4 rounded-[10px] text-[13.5px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-[3px] focus-visible:ring-citation-bg"
        >
          <span className="shrink-0 flex items-center justify-center w-[18px]">
            <Icon />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
