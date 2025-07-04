"use client";
import { usePathname } from "next/navigation";
import Sidebar from "../../component/admincomponent/sidebar/Sidebar";
import AdminNavbar from "../../component/admincomponent/navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/admin.css";

// export const metadata = {
//   title: "Dashboard",
//   description: "Admin Dashboard Layout",
// };

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>; // ❌ Don't show navbar/sidebar
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
