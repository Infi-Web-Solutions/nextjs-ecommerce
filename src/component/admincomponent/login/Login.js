"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/context/OrganizationContext";
import { getSlugFromHostname } from "@/lib/slug";
import Swal from "sweetalert2";

export default function Admminlogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const context = useOrganization();
  
  const setOrganization = context?.setOrganization;
  const setLoading = context?.setLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/superadmin/adminlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: form.email, 
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login successful!",
          timer: 1500,
          showConfirmButton: false
        });

        const orgRes = await fetch("/api/superadmin/createuser");
        const orgData = await orgRes.json();

        if (orgRes.ok && orgData.success && orgData.user?.organization) {
          if (setOrganization) setOrganization(orgData.user.organization);
        }

        if (setLoading) setLoading(false);
        router.push("/admin");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 fw-bold text-primary">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="admin@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

