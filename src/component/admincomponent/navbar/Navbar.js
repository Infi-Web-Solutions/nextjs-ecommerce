"use client";

import { useOrganization } from "@/context/OrganizationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
export default function AdminNavbar() {
  const { organization, loading } = useOrganization();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/admin/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-3">
      <div className="container-fluid">
        {/* Left: Logo and Organization Name */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          {/* <img src="/logo.png" alt="Logo" width="32" height="32" className="me-2" /> */}
          <h2 className="fw-semibold  mb-0">
            {loading ? "Loading..." : organization?.name || "Admin Panel"}
          </h2>
        </a>
        {/* Right: Profile Dropdown */}
        <div className="d-flex align-items-center gap-3">
      
      {/* Search Bar */}
      <form className="d-none d-md-flex">
        <input
          className="form-control"
          type="search"
          placeholder="Search..."
          aria-label="Search"
        />
      </form>

      {/* Profile Icon with Dropdown */}
      <div className="dropdown position-relative">
        <button
          className="btn p-0 border-0 bg-transparent d-flex align-items-center"
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-expanded={showDropdown}
          id="dropdownUser"
        >
          <FaUserCircle size={28} className="text-secondary" />
        </button>

        <ul
          className={`dropdown-menu dropdown-menu-end mt-2 shadow-sm border-0 ${
            showDropdown ? "show" : ""
          }`}
          aria-labelledby="dropdownUser"
          style={{
            minWidth: "220px",
            right: 0,
            left: "auto",
            zIndex: 9999,
          }}
        >
          <li>
            <div className="dropdown-header text-muted small px-3">
              Logged in as Admin
            </div>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button
              className="dropdown-item d-flex align-items-center px-3 py-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </li>
        </ul>
      </div>
        
      </div>
      </div>
    </nav>
  );
}
