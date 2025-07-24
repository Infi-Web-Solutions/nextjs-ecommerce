"use client";

import Link from "next/link";
import "./navbar.css";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useTranslations } from '@/lib/TranslationsProvider';
import { FaCog } from "react-icons/fa"; // Icon for settings

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },  
  { code: "hi", label: "हिन्दी" }     
];

const orgSlug = typeof window !== "undefined" ? window.location.hostname.split(".")[0] : "";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [features, setFeatures] = useState([]);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const langMatch = pathname.match(/^\/(en|fr|de)/);
    if (langMatch) setCurrentLang(langMatch[1]);
  }, [pathname]);

  const selectedLangLabel = languages.find(l => l.code === currentLang)?.label || "English";

  function hasFeature(name) {
    return features.some((f) => f.name === name && f.enabled);
  }

  const handleUpgradeAlert = () => {
    Swal.fire({
      icon: "info",
      title: t("alerts.upgradeTitle"),
      text: t("alerts.upgradeText"),
      confirmButtonText: t("alerts.upgradeButton"),
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/user/plans");
      }
    });
  };

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: t("alerts.logoutConfirmTitle"),
      text: t("alerts.logoutConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("alerts.logoutConfirmYes"),
      cancelButtonText: t("alerts.logoutConfirmCancel"),
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: t("alerts.logoutSuccessTitle"),
          text: t("alerts.logoutSuccessText"),
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/auth/login");
      } else {
        Swal.fire(t("alerts.logoutErrorTitle"), t("alerts.logoutErrorText"), "error");
      }
    } catch (err) {
      console.error("Logout error:", err);
      Swal.fire(t("alerts.logoutErrorTitle"), t("alerts.genericError"), "error");
    }
  };

  const changeLanguage = (lang) => {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
    const newPath = pathname.replace(/^\/(en|fr|de)/, `/${lang}`);
    router.push(newPath);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" href="/">
         {orgSlug ? `${orgSlug.toUpperCase()}  ` : ""}
        {/* {t("navbar.ProductManager")} */}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="mainNavbar">
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link" href="/">{t("navbar.home")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/user/products">{t("navbar.products")}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/user/plans">{t("navbar.upgradePlans")}</Link>
            </li>
            {/* <li className="nav-item">
              {hasFeature("document") ? (
                <Link className="nav-link" href="/user/document">{t("navbar.document")}</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white p-0">
                  {t("navbar.document")}
                </button>
              )}
            </li>
            <li className="nav-item">
              {hasFeature("learning") ? (
                <Link className="nav-link" href="/user/learn">{t("navbar.learning")}</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white p-0">
                  {t("navbar.learning")}
                </button>
              )}
            </li> */}
            <li className="nav-item">
              {hasFeature("my order") ? (
                <Link className="nav-link" href="/user/orders">{t("navbar.myOrders")}</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white p-0">
                  {t("navbar.myOrders")}
                </button>
              )}
            </li>

            {/* Language Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white p-0"
                id="langDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Language: {selectedLangLabel}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="langDropdown">
                {languages.map(({ code, label }) => (
                  <li key={code}>
                    <button
                      className={`dropdown-item ${currentLang === code ? "bg-dark text-white" : ""}`}
                      onClick={() => changeLanguage(code)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* Settings Dropdown with Logout */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white p-0 d-flex align-items-center gap-1"
                id="settingsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
               Settings
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
                <li>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    {t("navbar.logout")}
                  </button>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
