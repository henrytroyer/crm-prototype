import { I58_LOGO_COLOR_URL } from '../../constants/i58Brand';
import type { ContactEmailMessage } from '../../types/contact';

interface EmailDirectionIndicatorProps {
  direction: ContactEmailMessage['direction'];
  size?: 'sm' | 'md';
}

const logoHeights = {
  sm: 'h-5',
  md: 'h-6',
} as const;

export default function EmailDirectionIndicator({
  direction,
  size = 'sm',
}: EmailDirectionIndicatorProps) {
  const isOutbound = direction === 'outbound';
  const label = isOutbound ? 'Sent from i58' : 'Received into i58';
  const logoClass = `${logoHeights[size]} w-auto shrink-0 object-contain`;

  return (
    <span
      className="mt-0.5 flex shrink-0 items-center gap-0.5 text-crm-slate"
      aria-label={label}
      title={label}
    >
      {!isOutbound && <DirectionArrow direction="left" />}
      <img src={I58_LOGO_COLOR_URL} alt="" className={logoClass} aria-hidden />
      {isOutbound && <DirectionArrow direction="right" />}
    </span>
  );
}

function DirectionArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="h-3 w-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      {direction === 'right' ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 12h14m0 0l-6-6m6 6l-6 6"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M19 12H5m0 0l6-6m-6 6l6 6"
        />
      )}
    </svg>
  );
}
