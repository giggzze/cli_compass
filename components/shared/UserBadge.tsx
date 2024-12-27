import Image from "next/image";

interface UserBadgeProps {
  avatarUrl?: string | null;
  username?: string | null;
  label?: string;
}

export function UserBadge({ avatarUrl, username, label = "Owner" }: UserBadgeProps) {
  if (!username) return null;

  return (
    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={`${username}'s avatar`}
          width={16}
          height={16}
          className="rounded-full"
        />
      )}
      {label}: {username}
    </span>
  );
}
