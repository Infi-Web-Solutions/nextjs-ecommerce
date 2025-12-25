"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import ProductCard from "../../component/usercomponent/products/ProductCard";
import BannerSlider from "../../component/usercomponent/BannerSlider";
import { useTranslations } from "@/lib/TranslationsProvider";
import { translateText } from '../../lib/translate';
import { getSlugFromHostname } from "@/lib/slug";
import AOS from "aos";
import "aos/dist/aos.css";
import { Poppins, Inter } from "next/font/google";
import { Playfair_Display, Lato } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lato",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
});
export default function UserHomePage() {
  const [products, setProducts] = useState([]);
  const t = useTranslations();


  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    async function fetchProducts() {
      try {
        const hostname = window.location.hostname;
        const slug = getSlugFromHostname(hostname);
        console.log("Homepage Slug detected:", slug);


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
            "x-org-slug": slug,
          },
        });

        const result = await res.json();
        console.log("Product:", result);

        if (result.success) {
          setProducts(result.data);
          AOS.refresh();
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    }

    fetchProducts();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);


  return (
    <>
      {/* <div className="container-fluid p-0">
        <Image
          src="/images/bg3.jpg"
          alt="Banner"
          width={1920}
          height={600}
          style={{
            height: "100vh",
            objectFit: "cover",
          }}
        />
      </div> */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "40px 20px",
          color: "#000",
          marginTop: "54px",
        }}
      >
        <div className="text-center">
          <h1
            className={playfair.className}
            style={{
              fontWeight: "700",
              fontSize: "3rem", // increased from 2rem to 3rem
              marginBottom: "20px",
            }}
          >
            {t("homepage.title")}
          </h1>
          <p
            className={lato.className}
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              fontSize: "1.25rem",
              lineHeight: "1.8",
            }}
          >
            {t("homepage.description")}
          </p>
         <button
  style={{
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#ffffff",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(79, 70, 229, 0.35)",
    transition: "all 0.3s ease",
    marginTop: "10px",
  }}
>
  {t("homepage.button")}
</button>

        </div>

        <BannerSlider />
      </div>

      <div className="container py-3">
        <h2 className="mb-4 text-center">{t("product.availableProducts")}</h2>
        <div className="row g-4">
          {products.map((product, index) => (
            <div
              className="col-md-4"
              key={product._id}
            // data-aos="fade-up"
            // data-aos-delay={index * 100}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
