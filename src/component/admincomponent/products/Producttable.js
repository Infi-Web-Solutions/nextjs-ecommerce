'use client';

import DataTableWrapper from "../../sharedcomponent/datatable/Table";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Swal from "sweetalert2";
export default function ProductTable({ product }) {
  const router = useRouter();
  const [permissions, setPermissions] = useState([]);

  const currentLang = "en"; // Hardcoded for admin-only English

  useEffect(() => {
    fetch("/api/userpermission")
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    console.log("Product Data in Table:", product);
  }, [product]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.ok) {
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          window.location.reload(); // Simple reload to refresh list
        } else {
          Swal.fire("Error!", data.error || "Failed to delete.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };


  const baseColumns = [
    {
      name: "Product Category",
      selector: (row) => row.category || "N/A",
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`/uploads/${row.image}`}
          alt={row.name?.[currentLang] || "Image"}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name?.[currentLang] || row.name?.en || "N/A",
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `₹${row.price}`,
    },
    {
      name: "Description",
      selector: (row) => row.description?.[currentLang] || row.description?.en || "N/A",
    },
  ];

  // Always show action buttons for admin
  baseColumns.push({
    name: "Action",
    cell: (row) => (
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => router.push(`/admin/products/${row._id}`)}
        >
          Update
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(row._id)}
        >
          Delete
        </button>
      </div>
    ),
  });


  return <DataTableWrapper title="Product List" columns={baseColumns} data={product} />;
}
