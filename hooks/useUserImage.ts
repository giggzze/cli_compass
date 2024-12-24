import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function useUserImage() {
  const { user } = useUser();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Prefer imageUrl, fall back to profileImageUrl
      setImageUrl(user.imageUrl || user.profileImageUrl || null);
    }
  }, [user]);

  return imageUrl;
}
