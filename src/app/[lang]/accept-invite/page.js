"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleAccept = async () => {
    await axios.post("/api/superadmin/register-from-invite", {
      token,
      name,
      password,
    });
    setSubmitted(true);
  };

  if (submitted) return <div>Account created successfully!</div>;

  return (
    <div className="max-w-md mx-auto">
      <h2>Complete Registration</h2>
      <input
        placeholder="Your Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Create Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAccept}>Register</button>
    </div>
  );
}
