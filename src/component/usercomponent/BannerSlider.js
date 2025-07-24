"use client";

import { useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";


const EffectSlider = () => {
    useEffect(() => {
        new Swiper(".mySwiper", {
            slidesPerView: 5,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 5,
                },
            },
        });
    }, []);

    // ✅ Replace with your actual image names in public/images/
    const slides = [
        "/images/img1.jpg",
        "/images/img2.jpg",
        "/images/img3.jpg",
        "/images/img4.jpg",
        "/images/img5.jpg",
        "/images/img6.jpg",
        "/images/img7.jpg",
        "/images/img8.jpg",
        "/images/img9.jpg",
    ];

    return (
        <div style={{ width: "100%", height: "89vh" }}>

            <div className="swiper mySwiper">


                <div className="swiper-wrapper">
                    {slides.map((src, index) => (
                        <div className="swiper-slide" key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <div className="swiper-pagination"></div>
            </div>

            <style jsx>{`
        :global(.swiper) {
          width: 92%;
          height: 100%;
        }

        :global(.swiper-slide) {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #444;
          height: 75%;
          flex-shrink: 0;
          width: 100%;
          position: relative;
          transition-property: transform;
        }

        :global(.swiper-slide img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        :global(.swiper-pagination-bullet) {
          background: #fff;
        }

        :global(.swiper-pagination-bullet-active) {
          background: black;
        }
         :global(.swiper-pagination) {
    bottom: 15px; /* Adjust vertical position */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.swiper-pagination-bullet) {
    opacity: 0.6;
    background: #d3d0d0;
    width: 14px;
    height: 14px;
    margin: 0 6px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  :global(.swiper-pagination-bullet-active) {
    background: #000;
    opacity: 1;
    transform: scale(1.2);
  }
        :global(.swiper-android .swiper-slide),
        :global(.swiper-ios .swiper-slide),
        :global(.swiper-wrapper) {
          margin-top: 85px;
          transform: translate3d(0, 0, 0);
        }
      `}</style>
        </div>
    );
};

export default EffectSlider;
