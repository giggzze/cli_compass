export function CliLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Terminal Window Frame */}
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-900"
      />
      {/* Command Prompt Symbol */}
      <path
        d="M6 10L9 12L6 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-900"
      />
      {/* Compass Needle */}
      <path
        d="M13 9L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-gray-900"
      />
      {/* Compass Point */}
      <circle
        cx="15"
        cy="15"
        r="1"
        fill="currentColor"
        className="text-gray-900"
      />
    </svg>
  );
}
