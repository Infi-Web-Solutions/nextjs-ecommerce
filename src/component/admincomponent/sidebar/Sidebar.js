"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusCircle,
  FaClipboardList,
  FaUserPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (href) => pathname === href;

  useEffect(() => {
    setMounted(true);


    fetch("/api/userpermission")
      .then((res) => res.json())
      .then((data) => {
        setPermissions(data.permissions || []);
      });
  }, []);


  if (!mounted) return null;

  return (
    <div className="sidebar">
      <nav>
        <Link href="/admin" className={isActive("/admin") ? "active" : ""}>

          <div className="d-flex align-items-center gap-2">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </div>
        </Link>

        {/* Product Manager with dropdown toggle */}
        {permissions.includes("product_view") && (
          <div>
            <span
              className={isActive("/admin/products") ? "active" : ""}
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: "pointer", display: "block", marginBottom: "5px", padding: "10px" }}
            >


              <div className="d-flex align-items-center gap-2">
                <FaBoxOpen />
                <span>Product Manager {showDropdown ? "▲" : "▼"}</span>
              </div>
            </span>

            {showDropdown && (
              <div style={{ paddingLeft: "10px" }}>
                {permissions.includes("product_view") && (
                  <Link
                    href="/admin/products"
                    className={isActive("/admin/products") ? "active" : ""}
                  >

                    <div className="d-flex align-items-center gap-2">
                      <FaClipboardList />
                      <span>Product List</span>
                    </div>

                  </Link>
                )}

                {permissions.includes("product_create_product") && (
                  <Link
                    href="/admin/products/create"
                    className={isActive("/admin/products/create") ? "active" : ""}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <FaPlusCircle />
                      <span>Create Product</span>
                    </div>

                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {permissions.includes("order_view") && (
          <Link href="/admin/orders" className={isActive("/admin/orders") ? "active" : ""}>
            <FaClipboardList /> Order Manager
          </Link>
        )}

        {permissions.includes("createuser_viewcreateuser") && (
          <Link
            href="/admin/superadmin/users"
            className={`${isActive("/admin/superadmin/users") ? "active" : ""}`}
          >
            <div className="d-flex align-items-center gap-2">
              <FaUserPlus />
              <span>Create User</span>
            </div>
          </Link>

        )}
        
  <Link href="/admin/appusers" className={isActive("/admin/appusers") ? "active" : ""}>
    <div className="d-flex align-items-center gap-2">
      <FaTachometerAlt />
      <span>App Users</span>
    </div>
  </Link>


      </nav>
    </div>
  );
}
