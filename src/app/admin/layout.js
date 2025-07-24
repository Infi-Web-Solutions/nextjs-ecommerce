import { OrganizationProvider } from "@/context/OrganizationContext";
import AdminLayoutClient from "./AdminLayoutClient";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <OrganizationProvider>
          <AdminLayoutClient>{children}</AdminLayoutClient>
        </OrganizationProvider>
      </body>
    </html>
  );
}
