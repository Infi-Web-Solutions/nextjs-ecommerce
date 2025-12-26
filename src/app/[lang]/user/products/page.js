"use client";
import { useEffect, useState } from "react";
import ProductCard from "../../../../component/usercomponent/products/ProductCard";
import { useTranslations } from "@/lib/TranslationsProvider";
import { getSlugFromHostname } from "@/lib/slug";
import { Playfair_Display, Lato } from "next/font/google";
import Swal from "sweetalert2";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
});

export default function UserProductPage() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const t = useTranslations();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const hostname = window.location.hostname;
        const slug = getSlugFromHostname(hostname);
        console.log("UserProductPage Slug detected:", slug);


        if (!slug) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Organization not found in URL.",
          });
          return;
        }

        const res = await fetch("/api/products", {
          headers: {
            "x-org-slug": slug, // <-- Custom header
          },
        });

        const result = await res.json();
        console.log("Product:", result);

        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    }

    fetchProducts();
  }, []);


  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="container py-4">
      {/* <h2 className="mb-4">{t("product.availableProducts")}</h2> */}
      <h2 className={`${playfair.className} heading`}>
        {t("product.availableProducts")}
      </h2>


      <div className="row g-4">
        {currentProducts.map((product) => (
          <div className="col-md-4" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>
                {t("product.pagination.previous")}
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                {t("product.pagination.next")}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
