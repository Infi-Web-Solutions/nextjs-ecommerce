"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const handleBuyNow = async () => {
  const res = await fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product }),
  });

  const result = await res.json();
  if (result.success) {
    window.location.href = result.url;
  } else {
    alert("Payment failed: " + result.error);
  }
};

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const result = await res.json();
      setProduct(result.data);
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;


  const imageUrl = product.image
    ? `/uploads/${product.image}`
    : "/placeholder.png";

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className="fw-bold text-primary">Price: ₹{product.price}</p>
          <button onClick={handleBuyNow} className="btn btn-success">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
