"use client";

import { useEffect, useState } from "react";
import { useOrganization } from "@/context/OrganizationContext";

export default function UsersPage() {
  const { organization, loading: orgLoading } = useOrganization();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgLoading) return; // wait for organization to load
    if (!organization?._id) return;

    async function fetchUsers() {
      try {
        const res = await fetch(`/api/users?orgId=${organization._id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setUsers(data.data);
        } else {
          console.error("Failed to fetch users:", data.error);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [organization, orgLoading]);

  if (orgLoading || loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users in Organization</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user._id} className="border p-4 rounded shadow">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Provider:</strong> {user.provider}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
