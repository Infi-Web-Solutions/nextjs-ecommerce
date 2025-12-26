"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orderSaved, setOrderSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function saveOrder() {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const { session } = await res.json();

        if (!session?.metadata) {
          throw new Error("Session metadata is missing.");
        }

        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: {
              _id: session.metadata.productId,
              name: session.metadata.productName,
              price: Number(session.metadata.price),
            },
            paymentIntentId: session.payment_intent,
            quantity: 1,
          }),
        });

        const result = await orderRes.json();
        if (result.success) {
          setOrderSaved(true);
        } else {
          setError(result.error || "Failed to save order.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) saveOrder();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2"> Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.push("/user/products")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Products
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h2>
          <p className="text-gray-700 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-500">Your order has been placed and is being processed.</p>

          <button
            type="button"
            onClick={() => router.push("/user/orders")}
            className="mt-6 bg-green-600 hover:bg-green-500  bg-green px-6 py-2 rounded-lg transition duration-200"
            
          >
            View Orders
          </button>

        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
