"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from '@/lib/TranslationsProvider';
import Swal from "sweetalert2";
import Link from "next/link";

import { useState } from "react";

export default function Signup() {
   const t = useTranslations();
    const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch("/api/auth/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(form),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       alert("User registered successfully!");
        
  //       // // Optionally reset form
  //       // setForm({ name: "", email: "", contact: "", password: "" });
  //       router.push("/auth/login");
  //     } else {
  //       alert(data.message || "Something went wrong.");
  //     }
  //   } catch (err) {
  //     console.error("Signup error:", err);
  //     alert("Signup failed.");
  //   }
  // };


  //  const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const res = await fetch("/api/signup", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(form),
  //     });

  //     if (res.ok) {
  //       await Swal.fire({
  //         icon: "success",
  //         title: t("register.success"),
  //         text: t("register.welcome"),
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });

  //       router.push("/auth/login");
  //     } else {
  //       const data = await res.json();
  //       Swal.fire({
  //         icon: "error",
  //         title: t("register.failed"),
  //         text: data.message || t("register.errorOccurred"),
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Register error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: t("register.oops"),
  //       text: t("register.errorOccurred"),
  //     });
  //   }
  // }; 

const handleSubmit = async (e) => {
  e.preventDefault();

  // Extract subdomain (slug) from URL
  const hostname = window.location.hostname; // e.g. snapmart.localhost
  const parts = hostname.split(".");
  const slug = parts.length >= 2 ? parts[0] : null;

  if (!slug) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Organization not found in URL.",
    });
    return;
  }

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        orgSlug: slug,
      }),
    });

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: t("register.success"),
        text: t("register.welcome"),
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/auth/login");
    } else {
      const data = await res.json();
      Swal.fire({
        icon: "error",
        title: t("register.failed"),
        text: data.message || t("register.errorOccurred"),
      });
    }
  } catch (error) {
    console.error("Register error:", error);
    Swal.fire({
      icon: "error",
      title: t("register.oops"),
      text: t("register.errorOccurred"),
    });
  }
};



  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container mt-3">
        <h1 className="text-center mb-4">{t("register.title")}</h1>

        <div className="row justify-content-center">
          <div className="col-md-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">{t("register.name")}</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder={t("register.enterName")}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div> 

              <div className="mb-3">
                <label className="form-label">{t("register.email")}</label>
                <input
                  name="email"
                  type="email"  
                  className="form-control"
                  placeholder={t("register.enterEmail")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">{t("register.contact")}</label>
                <input
                  name="contact"
                  type="text"
                  className="form-control"
                  placeholder={t("register.enterContact")}
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">{t("register.password")}</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder={t("register.enterPassword")}                
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-dark w-100">
               {t("register.button")}
              </button>
               <Link
                className="d-block text-center text-decoration-none"
                href="/auth/login"
              >
                {t("register.goForLogin")}
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
