"use client";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from '@/lib/TranslationsProvider';

export default function Login() {
  const t = useTranslations();
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const handleGoogleLogin = async () => {
    // await signIn("google", { callbackUrl: "/auth/callback" });
    await signIn("google", { callbackUrl: `${window.location.origin}/api/auth/set-token` });
  };

  const handleFacebookLogin = async () => {
    // await signIn("facebook", { callbackUrl: "/api/auth/set-token" });
    await signIn("facebook", { callbackUrl: `${window.location.origin}/api/auth/set-token` });
  };
  const handleGitHubLogin = async () => {
    // await signIn("github", { callbackUrl: "/api/auth/set-token" });
    await signIn("github", { callbackUrl: `${window.location.origin}/api/auth/set-token` });
  };

  const handleLinkdinLogin = async () => {
    await signIn("linkedin", { callbackUrl: "/api/auth/set-token" });


  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //  // Extract subdomain (slug) from URL
  //     const hostname = window.location.hostname; // e.g. snapmart.localhost
  //     const parts = hostname.split(".");
  //     const slug = parts.length >= 2 ? parts[0] : null;
    

  //     if (!slug) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Organization not found in URL.",
  //       });
  //       return;
  //     }
    

  //   try {
  //     const body = {
  //     ...form,
  //     orgSlug: slug,
  //   };

  //   // 3. Send POST request with form + slug
  //   const res = await fetch("/api/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body), // ✅ send slug in body
  //   });

  //     const data = await res.json();

  //     if (res.ok) {
  //       await Swal.fire({
  //         icon: "success",
  //         title: t("login.success"),
  //         text: t("login.welcome"),
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });

  //       router.push("/");
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: t("login.failed"),
  //         text: data.message || t("login.invalidCredentials")
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: t("login.oops"),
  //       text: t("login.errorOccurred")
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const slug = parts.length >= 2 ? parts[0] : null;

  if (!slug || slug === "localhost") {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Organization not found in URL.",
    });
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, orgSlug: slug }), // ✅ fix this
    });

    const data = await res.json();

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: t("login.success"),
        text: t("login.welcome"),
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/");
    } else {
      Swal.fire({
        icon: "error",
        title: t("login.failed"),
        text: data.message || t("login.invalidCredentials"),
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    Swal.fire({
      icon: "error",
      title: t("login.oops"),
      text: t("login.errorOccurred"),
    });
  }
};


  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container mt-3">
        <h1 className="text-center mb-4">{t("login.title")}</h1>

        <div className="row justify-content-center">
          <div className="col-md-4 bg-light p-4 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
              <label className="form-label">{t("login.email")}</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder={t("login.enterEmail")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">{t("login.password")}</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder={t("login.enterPassword")}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark w-100 mb-3">
              {t("login.button")}
              </button>

              <Link
                className="d-block text-center text-decoration-none"
                href="/auth/signup"
              >
               {t("login.registerLink")}
              </Link>
            </form>
            <div className="d-flex justify-content-center mt-3">
              <button
                type="button"
                className="btn d-flex align-items-center justify-content-center"

                onClick={handleGoogleLogin}
                title="Login with Google"
              >
                <img
                  src="/images/google.png"
                  alt="Google"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              </button>

              <button
                type="button"
                className="btn  d-flex align-items-center justify-content-center"
                onClick={handleFacebookLogin}
                title="Login with Facebook"
              >
                <img src="/images/facebook.png" alt="Facebook" width={24} height={24} />
              </button>

              <button
                type="button"
                className="btn  d-flex align-items-center justify-content-center"

                onClick={handleGitHubLogin}
                title="Login with GitHub"
              >
                <img src="/images/github.png" alt="GitHub" width={24} height={24} />
              </button>
              {/* <button
                type="button"
                className="btn  d-flex align-items-center justify-content-center"

                onClick={handleLinkdinLogin}
                title="Login with GitHub"
              >
                <img src="/images/linkedin.png" alt="GitHub" width={28} height={28} />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
