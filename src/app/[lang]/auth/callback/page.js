"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {

    router.push("/api/auth/set-token");
  }, [router]);

  return <p>Logging in with Google...</p>;
}
