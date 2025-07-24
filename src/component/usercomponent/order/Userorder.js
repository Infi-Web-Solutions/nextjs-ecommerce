"use client";
import DataTableWrapper from "../../sharedcomponent/datatable/Table";
import { useParams } from "next/navigation";
export default function UserOrderTable({ orders }) {
  const { lang } = useParams();
  const columns = [
    {
      name: "Image",
      cell: row => (
        <img
          src={`/uploads/${row.productId?.image}`}
          alt={row.productId?.name?.[lang] || row.productId?.name?.en}
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
    name: "Product",
    selector: row => row.productId?.name?.[lang] || row.productId?.name?.en,
    sortable: true,
  },
    { name: "Price", selector: row => `₹${row.price}` },
    { name: "Quantity", selector: row => row.quantity },
    {
      name: "Status",
      selector: row => row.orderStatus,
      cell: row => (
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            row.orderStatus === "processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {row.orderStatus}
        </span>
      ),
    },
    { name: "Ordered On", selector: row => new Date(row.createdAt).toLocaleString() },
  ];

  return (
    <DataTableWrapper
      title="Your Orders"
      columns={columns}
      data={orders}
      lang={lang}
    />
  );
}
