// import ProductForm from "../../../../component/admincomponent/products/Prodcutform";

// export default function ProductsPage() {
//   return (
//     <div>
//       <h1>Product Manager</h1>
//       <p>This is the product manager page.</p>
//       <ProductForm />
//     </div>
//   );
// }


"use client";
import ProductForm from "@/component/admincomponent/products/Prodcutform";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();

  const handleCreate = async (form) => {
    const formData = new FormData();
    console.log("Form data before submission:", form);
    formData.append("nameEn", form.name.en || form.name); // ✅ just string
  formData.append("descEn", form.description.en || form.description);

  if (form.price) formData.append("price", form.price);
  if (form.stock) formData.append("stock", form.stock);
  if (form.category) formData.append("category", form.category);
  if (form.image) formData.append("image", form.image);


    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        console.log("Product created:", result.data);
        alert("Product created successfully!");
        router.push("/admin/products");
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Create error:", err);
      alert("Unexpected error occurred");
    }
  };

  return (
    <div className="container py-4">
      <h2>Create Product</h2>
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}
