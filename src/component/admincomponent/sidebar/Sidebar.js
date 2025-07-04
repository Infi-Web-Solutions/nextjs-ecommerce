"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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
          Dashboard
        </Link>

        {/* Product Manager with dropdown toggle */}
        {permissions.includes("product_view") && (
          <div>
            <span
              className={isActive("/admin/products") ? "active" : ""}
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ cursor: "pointer", display: "block", marginBottom: "5px", padding: "10px" }}
            >
              Product Manager {showDropdown ? "▲" : "▼"}
            </span>

            {showDropdown && (
              <div style={{ paddingLeft: "10px" }}>
                {permissions.includes("product_view") && (
                  <Link
                    href="/admin/products"
                    className={isActive("/admin/products") ? "active" : ""}
                  >
                    Product List
                  </Link>
                )}

                {permissions.includes("product_create_product") && (
                  <Link
                    href="/admin/products/create"
                    className={isActive("/admin/products/create") ? "active" : ""}
                  >
                    Create Product
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {permissions.includes("order_view") && (
          <Link href="/admin/orders" className={isActive("/admin/orders") ? "active" : ""}>
            Order Manager
          </Link>
        )}

        {permissions.includes("createuser_viewcreateuser") && (
          <Link
            href="/admin/superadmin/users"
            className={isActive("/admin/superadmin/users") ? "active" : ""}
          >
            Create User
          </Link>
        )}
      </nav>
    </div>
  );
}
