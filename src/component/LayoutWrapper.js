"use client";

import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePathname } from "next/navigation";

import Navbar from "@/component/usercomponent/navbar/Navbar";
import Footer from "@/component/usercomponent/footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideLayoutOn = ["/auth/signup", "/auth/login"];
  const shouldHideLayout =
    hideLayoutOn.includes(pathname) || pathname === "/admin/login";

  // ✅ Only import Bootstrap JS in browser
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
}
