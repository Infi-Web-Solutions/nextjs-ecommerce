
"use client";

import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();
    async function handleLogout() {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
  
        if (res.ok) {
          router.push("/auth/login");
        } else {
          console.error("Logout failed");
        }
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm ${styles.navbar} `}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand fw-bold">Admin Panel</span>
        <div>
          {/* <button className="btn btn-outline-primary me-2">Settings</button> */}
          <button className=" btn btn-danger"  onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
