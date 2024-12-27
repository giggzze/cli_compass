interface PrivacyBadgeProps {
  isPrivate: boolean;
}

export function PrivacyBadge({ isPrivate }: PrivacyBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        isPrivate
          ? "bg-purple-100 text-purple-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {isPrivate ? "Private" : "Public"}
    </span>
  );
}
