"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMarketPrices } from "./lib/api";
import { MarketPrice } from "./types/market";
import { ArrowRight, Store } from "lucide-react";
import HeroCarousel from "./components/HeroCarousel";

export default function Home() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const data = await getMarketPrices();
      setPrices(data);
      setError(null);
    } catch (err) {
      setError("Failed to load market prices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return (
      new Intl.NumberFormat("km-KH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(price)) + " ៛"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("km-KH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const latestPrices = prices.slice(0, 6);

  if (loading) {
    return (
      <div className="flex grow items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            កំពុងទាញយកទិន្នន័យ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grow bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroCarousel />
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-green-50 dark:bg-green-900 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h1 className="text-medium text-green-800 dark:text-green-200 truncate">
                  ចំនួនផលិតផលសរុប
                </h1>
                <h1 className="mt-1 text-3xl font-semibold text-green-600 dark:text-green-300">
                  {new Set(prices.map((p) => p.Product)).size}
                </h1>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h1 className="text-medium text-blue-800 dark:text-blue-200 truncate">
                  ចំនួនទីផ្សារ
                </h1>
                <h1 className="mt-1 text-3xl font-semibold text-blue-600 dark:text-blue-300">
                  {new Set(prices.map((p) => p.Market)).size}
                </h1>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h1 className="text-medium text-orange-800 dark:text-orange-200 truncate">
                  កាលបរិច្ឆេទអាប់ដេត
                </h1>
                <h1 className="mt-1 text-lg font-semibold text-orange-600 dark:text-orange-300">
                  {prices.length > 0 ? formatDate(prices[0].PriceDate) : "N/A"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Prices Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              តម្លៃផលិតផលថ្មីៗ
            </h2>
            <Link
              href="/prices"
              className="text-green-600 flex flex-row hover:text-green-700 font-semibold"
            >
              មើលទាំងអស់ <ArrowRight />
            </Link>
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={loadPrices}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                ព្យាយាមម្តងទៀត
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPrices.map((price) => (
                <div
                  key={price.PriceID}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {price.ProductName}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {price.MarketName}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {formatPrice(price.Price)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(price.PriceDate)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {prices.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                <Store />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                មិនមានទិន្នន័យតម្លៃទីផ្សារ
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            លក្ខណៈពិសេស
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">ទិន្នន័យអាប់ដេត</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ទិន្នន័យតម្លៃផលិតផលត្រូវបានអាប់ដេតជារៀងរាល់ថ្ងៃ
              </p>
            </div>
            <div className="text-center bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">ពហុទីផ្សារ</h3>
              <p className="text-gray-600 dark:text-gray-400">
                តាមដានតម្លៃពីទីផ្សារជាច្រើននៅទូទាំងប្រទេស
              </p>
            </div>
            <div className="text-center bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">វិភាគតម្លៃ</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ការវិភាគតម្លៃ និងទិន្នន័យស្ថិតិដើម្បីជួយសំរេចចិត្ត
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
