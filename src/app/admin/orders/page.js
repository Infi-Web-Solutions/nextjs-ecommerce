// "use client";
// import { useEffect, useState } from "react";
// import OrderTable from "../../../component/admincomponent/orders/OrderTable";

// export default function AdminOrderList() {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     async function fetchOrders() {
//       const res = await fetch("/api/orders");
//       const data = await res.json();
//       if (data.success) setOrders(data.data);
//     }
//     fetchOrders();
//   }, []);

//   return (
//     <div className="container py-4">
//       <h2 className="mb-4">Order List</h2>
//       <OrderTable orders={orders} />
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import OrderTable  from "@/component/admincomponent/orders/OrderTable";

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/orders");
      const data = await res.json();
      console.log("Fetched orders:", data);
      if (data.success) setOrders(data.data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="container py-4">
      <OrderTable orders={orders} />
    </div>
  );
}

