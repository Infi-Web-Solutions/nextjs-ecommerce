
"use client";
import { useOrganization } from "@/context/OrganizationContext";

export default function DashboardPage() {
  const { organization, loading } = useOrganization();

  if (loading) return <p>Loading organization...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Organization: {organization?.name || "Unknown"}</p>
    </div>
  );
}
