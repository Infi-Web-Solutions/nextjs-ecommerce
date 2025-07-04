"use client";
import Swal from "sweetalert2";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome!`,
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/"); 
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
      title: "Oops...",
      text: "Something went wrong!",
    });
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

              <Link
                className="d-block text-center text-decoration-none"
                href="/auth/signup"
              >
                Don’t have an account? Register
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
