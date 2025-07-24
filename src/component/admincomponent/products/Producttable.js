'use client';

import DataTableWrapper from "../../sharedcomponent/datatable/Table";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

  const hasActionPermission =
    permissions.includes("product_update_product") ||
    permissions.includes("product_delete");

  if (hasActionPermission) {
    baseColumns.push({
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          {permissions.includes("product_update_product") && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => router.push(`/admin/products/${row._id}`)}
            >
              Update
            </button>
          )}
        </div>
      ),
    });
  }

  return <DataTableWrapper title="Product List" columns={baseColumns} data={product} />;
}
