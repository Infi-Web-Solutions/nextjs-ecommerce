"use client";
import Link from "next/link";
import "./navbar.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [features, setFeatures] = useState([]);

  useEffect(() => {
  async function fetchPlan() {
    try {
      const userId = localStorage.getItem("userId");
      console.log("userId from localStorage:", userId); 

      const res = await fetch("/api/plans", {
        headers: {
          "user-id": userId,
        },
      });

      const result = await res.json();
      if (result.success) {
        setFeatures(result.data?.features || []);
      } else {
        console.error("API Error:", result.error);
      }
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    }
  }

  fetchPlan();
}, []);


  function hasFeature(name) {
    return features.some((f) => f.name === name && f.enabled);
  }

  const handleUpgradeAlert = () => {
    Swal.fire({
      icon: "info",
      title: "Upgrade Required",
      text: "This feature is available only on higher plans. Please upgrade.",
      confirmButtonText: "Upgrade Now",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/user/plans");
      }
    });
  };

  async function handleLogout() {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been successfully logged out.",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/auth/login");
      } else {
        Swal.fire("Error", "Logout failed", "error");
      }
    } catch (err) {
      console.error("Logout error:", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary custom-navbar">
      <div className="container">
        <Link className="navbar-brand" href="/">ProductManager</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="/user/products">Products</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="/user/plans">Upgrade Plans</Link>
            </li>

            {/* Document */}
            <li className="nav-item">
              {hasFeature("document") ? (
                <Link className="nav-link" href="/user/document">Document</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white" style={{ textDecoration: "none" }}>
                  Document
                </button>
              )}
            </li>

            {/* Learning */}
            <li className="nav-item">
              {hasFeature("learning") ? (
                <Link className="nav-link" href="/user/learn">Learning</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white" style={{ textDecoration: "none" }}>
                  Learning
                </button>
              )}
            </li>

            {/* My Orders */}
            <li className="nav-item">
              {hasFeature("my order") ? (
                <Link className="nav-link" href="/user/orders">My Orders</Link>
              ) : (
                <button onClick={handleUpgradeAlert} className="nav-link btn btn-link text-white" style={{ textDecoration: "none" }}>
                  My Orders
                </button>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link" href="/auth/login">Login</Link>
            </li>

            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link logoutbutton text-danger" type="button">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
