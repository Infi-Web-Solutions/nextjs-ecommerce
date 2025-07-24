"use client";
import "./footer.css";
import { useTranslations } from '@/lib/TranslationsProvider';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="footer bg-dark text-white py-3">
      <div className="container text-center">
        <p className="mb-1">
          © {new Date().getFullYear()} {t("footer.copy")}
        </p>
        <p className="mb-0">
          <a href="/privacy" className="text-white me-3">{t("footer.privacyPolicy")}</a>
          <a href="/terms" className="text-white">{t("footer.termsOfService")}</a>
        </p>
      </div>
    </footer>
  );
}
