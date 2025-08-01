"use client";
import { useEffect, useState } from "react";
import UserOrderTable from "../../../../component/usercomponent/order/Userorder";
import { useParams } from "next/navigation";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { lang } = useParams();
  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/userorder");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        console.error(data.error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      {orders.length > 0 ? (
        <UserOrderTable orders={orders} lang={lang} />
      ) : (
        <p className="text-center text-gray-600 mt-10">You have no orders yet.</p>
      )}
    </div>
  );
}
