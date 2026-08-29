"use client";

export type OAuthProvider = "google" | "apple" | "facebook";

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

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
      <path d="M13.09 15.47c-.72 1.04-1.47 2.06-2.64 2.08-1.15.02-1.52-.68-2.83-.68-1.31 0-1.72.66-2.81.7-1.13.04-1.99-1.12-2.72-2.15-1.48-2.13-2.62-6.03-1.09-8.66a4.2 4.2 0 0 1 3.55-2.16c1.11-.02 2.16.75 2.83.75.68 0 1.95-.92 3.29-.79.56.03 2.13.23 3.14 1.7-.08.05-1.88 1.1-1.86 3.28.02 2.6 2.28 3.47 2.31 3.48-.02.07-.36 1.24-1.19 2.46l-.63.36ZM9.1 3.2c.6-.72 1-1.73.89-2.73-.86.03-1.9.57-2.52 1.29-.55.63-1.04 1.65-.91 2.62.96.08 1.94-.49 2.55-1.18Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M18 9a9 9 0 1 0-10.41 8.89v-6.29H5.31V9h2.28V7.02c0-2.25 1.34-3.5 3.4-3.5.98 0 2.01.18 2.01.18v2.22h-1.13c-1.12 0-1.47.69-1.47 1.4V9h2.5l-.4 2.6h-2.1v6.29A9 9 0 0 0 18 9Z"
      />
      <path
        fill="#fff"
        d="m12.5 11.6.4-2.6h-2.5V7.32c0-.71.35-1.4 1.47-1.4H13V3.7s-1.03-.18-2.01-.18c-2.06 0-3.4 1.25-3.4 3.5V9H5.31v2.6h2.28v6.29a9.1 9.1 0 0 0 2.81 0V11.6h2.1Z"
      />
    </svg>
  );
}

const PROVIDERS: { id: OAuthProvider; label: string; Icon: () => JSX.Element }[] = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "apple", label: "Continue with Apple", Icon: AppleIcon },
  { id: "facebook", label: "Continue with Facebook", Icon: FacebookIcon },
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
