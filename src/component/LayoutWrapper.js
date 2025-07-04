"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/component/usercomponent/navbar/Navbar";
import Footer from "@/component/usercomponent/footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideLayoutOn = ["/auth/signup", "/auth/login"];
  const shouldHideLayout = hideLayoutOn.includes(pathname)|| pathname === "/admin/login";

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
}
