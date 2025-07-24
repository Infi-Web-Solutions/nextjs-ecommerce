"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@/context/OrganizationContext";

export default function Admminlogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();
  const { setOrganization,setLoading } = useOrganization();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const res = await fetch("/api/superadmin/adminlogin", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Login successful!");

//       // Fetch org immediately after login
//       const orgRes = await fetch("/api/superadmin/createuser");
//       const orgData = await orgRes.json();

//       if (orgRes.ok && orgData.success && orgData.user?.organization) {
//         setOrganization(orgData.user.organization); // ✅ preload org
//       }
//       setLoading(false);
//       router.push("/admin");
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     alert("Something went wrong");
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
      console.log("slugslugslug",slug)
      const res = await fetch("/api/superadmin/adminlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, orgSlug: slug }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");

        // Optional: Preload organization
        const orgRes = await fetch("/api/superadmin/createuser");
        const orgData = await orgRes.json();

        if (orgRes.ok && orgData.success && orgData.user?.organization) {
          setOrganization(orgData.user.organization); // Set context
        }

        setLoading(false);
        router.push("/admin");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container mt-3">
        <h1 className="text-center mb-4">Login</h1>

        <div className="row justify-content-center">
          <div className="col-md-4 bg-light p-4 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
