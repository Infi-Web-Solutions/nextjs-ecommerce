"use client";
import { useRouter } from "next/navigation"; 
import { useTranslations } from "@/lib/TranslationsProvider";

export default function ProductCard({ product }) {
  const router = useRouter();
  const t = useTranslations();
  const locale = t.locale; // ✅ Extract current locale

  const handleOrderClick = () => {
    router.push(`/user/products/${product._id}`);
  };

  const imageUrl = product.image
    ? `/uploads/${product.image}`
    : "/placeholder.png";

  const localizedName = product.name?.[locale] || product.name?.en;
  const localizedDescription = product.description?.[locale] || product.description?.en;

  return (
  <div className="card h-100 shadow-sm mb-2">
  <img
    src={imageUrl}
    className="card-img-top"
    alt={localizedName}
    style={{ height: "200px", objectFit: "cover" }}
  />

  <div className="card-body d-flex flex-column">
    <h5 className="card-title">{localizedName}</h5>
    <p className="card-text">{localizedDescription}</p>
    <p className="card-text fw-bold text-dark">₹{product.price}</p>

    {/* Spacer pushes the button to the bottom */}
    <div className="mt-auto">
      <button className="btn btn-dark w-100" onClick={handleOrderClick}>
        {t("product.orderNow")}
      </button>
    </div>
  </div>
</div>

  );
}
