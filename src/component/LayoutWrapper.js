"use client";

import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePathname } from "next/navigation";

import Navbar from "@/component/usercomponent/navbar/Navbar";
import Footer from "@/component/usercomponent/footer/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Strip locale from pathname (e.g., /en/auth/login -> /auth/login)
  const pathWithoutLang = pathname.replace(/^\/(en|fr|de)/, "");

  const hideLayoutOn = ["/auth/signup", "/auth/login", "/admin/login"];
  const shouldHideLayout = hideLayoutOn.includes(pathWithoutLang);


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
