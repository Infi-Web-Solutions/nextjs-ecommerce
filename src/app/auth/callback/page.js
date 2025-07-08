"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Go to server route to set cookie
    router.push("/api/auth/set-token");
  }, []);

  return <p>Logging in with Google...</p>;
}
