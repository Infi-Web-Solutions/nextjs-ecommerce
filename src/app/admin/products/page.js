"use client";

import { useEffect, useState } from "react";
import ProductTable from "@/component/admincomponent/products/Producttable";
import Swal from "sweetalert2";

export default function AdminProductList() {
  const [product, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      // Extract subdomain
      const hostname = window.location.hostname;
      const parts = hostname.split(".");

      let slug = null;

      // Handle local and production cases
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        slug = "snapmart"; // 🔁 Change to test slug in local dev
      } else if (parts.length >= 3) {
        slug = parts[0]; // e.g., org.domain.com -> org
      } else if (parts.length === 2) {
        slug = parts[0]; // e.g., org.com -> org
      }

      console.log("Slug detected:", slug);

      if (!slug) {
        Swal.fire({
          icon: "error",
          title: "Organization not found",
          text: "Could not extract organization from URL.",
        });
        return;
      }

      try {
        const res = await fetch("/api/products", {
          headers: {
            "x-org-slug": slug, 
          },
        });
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          Swal.fire("Error", data.message || "Failed to fetch products", "error");
        }
      } catch (error) {
        console.error("API fetch error:", error);
        Swal.fire("Error", "Something went wrong", "error");
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container py-4">
      <ProductTable product={product} />
    </div>
  );
}
