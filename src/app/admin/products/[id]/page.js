"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/component/admincomponent/products/Prodcutform";

export default function UpdateProductPage() {

  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);

      const data = await res.json();
      console.log("data product with form:", data);
      if (data.success) setProduct(data.data);
    }
    fetchProduct();
  }, [id]);

  const handleUpdate = async (form) => {
    const formData = new FormData();
    
    // Extract English text for translation
    formData.append("nameEn", form.name?.en || "");
    formData.append("descEn", form.description?.en || "");
    
    if (form.price) formData.append("price", form.price);
    if (form.stock) formData.append("stock", form.stock);
    if (form.category) formData.append("category", form.category);
    if (form.image && form.image instanceof File) formData.append("image", form.image);

    console.log("FormData for update:", {
      nameEn: form.name?.en,
      descEn: form.description?.en,
      price: form.price,
      stock: form.stock,
      category: form.category,
      image: form.image
    });

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Unexpected error occurred");
    }
  };




  if (!product) return <p>Loading...</p>;

  return <ProductForm initialData={product} onSubmit={handleUpdate} />;
}
