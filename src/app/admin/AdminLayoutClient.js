"use client";
import { usePathname } from "next/navigation";
import AdminNavbar from "../../component/admincomponent/navbar/Navbar";
import Sidebar from "../../component/admincomponent/sidebar/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/admin.css";

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>; // No layout on login
  }

  return (
    <>
      <AdminNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4" style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </div>
    </>
  );
}
