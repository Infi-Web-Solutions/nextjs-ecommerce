"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductTable from "@/component/admincomponent/products/Producttable";

import Swal from "sweetalert2";

export default function AdminProductList() {
  const [product, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
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


  const router = useRouter();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <button 
          className="btn btn-success" 
          onClick={() => router.push("/admin/products/create")}
        >
          + Create Product
        </button>
      </div>
      <ProductTable product={product} />
    </div>
  );

}
