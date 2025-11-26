"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { carouselImages } from "../data/carousel-Images";
import { CircleDollarSign, Users } from "lucide-react";
import Link from "next/link";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <section className="relative h-[500px] overflow-hidden">
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={80}
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/40"></div>
          <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-khmer-heading">
                {image.title}
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-4 font-khmer-content">
                {image.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-green-400 scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/prices"
          className="bg-white flex flex-row text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
        >
          <CircleDollarSign width={22} height={22} className="mr-2" />
          មើលតម្លៃផលិតផល
        </Link>
        <Link
          href="/about"
          className="border-2 flex flex-row border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          <Users width={20} height={20} className="mr-2" />
          អំពីពួកយើង
        </Link>
      </div>
    </section>
  );
}
