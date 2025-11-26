"use client";

import { useState, useEffect } from "react";
import { getMarketPrices } from "../lib/api";
import { MarketPrice } from "../types/market";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";
import { Store } from "lucide-react";
import Loading from "../components/Loading";

export default function PricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [totalPrice, setTotalPrice] = useState(Number);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const data = await getMarketPrices();
      const totalPrice = data.reduce(
        (sum, item) => sum + Number(item.Price),
        0
      );
      console.log(totalPrice);
      setTotalPrice(totalPrice);
      setPrices(data);
      setError(null);
    } catch (err) {
      setError("Failed to load market prices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markets = Array.from(new Set(prices.map((p) => p.MarketName)));
  const filteredPrices = prices
    .filter((price) => {
      const matchesSearch = price.ProductName.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
      const matchesMarket =
        selectedMarket === "all" || price.MarketName === selectedMarket;
      return matchesSearch && matchesMarket;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-high":
          return parseFloat(b.Price) - parseFloat(a.Price);
        case "price-low":
          return parseFloat(a.Price) - parseFloat(b.Price);
        case "date":
          return (
            new Date(b.PriceDate).getTime() - new Date(a.PriceDate).getTime()
          );
        default:
          return a.ProductName.localeCompare(b.ProductName);
      }
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-khmer-heading mb-4">
            តម្លៃផលិតផលកសិកម្ម
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-khmer-content">
            តាមដានតម្លៃផលិតផលកសិកម្មពីទីផ្សារផ្សេងៗ
            ដើម្បីជួយអ្នកធ្វើការសម្រេចចិត្តដ៏ខ្លាំងក្លា
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
              ចំនួនតម្លៃសរុប
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-khmer-content">
              {formatPrice(`${totalPrice}`)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
              ប្រភេទផលិតផល
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-khmer-content">
              {new Set(prices.map((p) => p.Product)).size}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
              ចំនួនទីផ្សារ
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-khmer-content">
              {markets.length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
              អាប់ដេតចុងក្រោយ
            </div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 font-khmer-content">
              {prices.length > 0 ? formatDate(prices[0].PriceDate) : "N/A"}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                ស្វែងរកផលិតផល
              </label>
              <input
                type="text"
                placeholder="វាយឈ្មោះផលិតផល..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              />
            </div>

            {/* Market Filter */}
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                ជ្រើសរើសទីផ្សារ
              </label>
              <select
                title="selectMarket"
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              >
                <option value="all">ទីផ្សារទាំងអស់</option>
                {markets.map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                តម្រៀបតាម
              </label>
              <select
                title="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              >
                <option value="name">ឈ្មោះផលិតផល</option>
                <option value="price-high">តម្លៃខ្ពស់ទៅទាប</option>
                <option value="price-low">តម្លៃទាបទៅខ្ពស់</option>
                <option value="date">កាលបរិច្ឆេទថ្មី</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            បានរកឃើញ {filteredPrices.length} ផលិតផល
          </p>
        </div>

        {/* Prices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 mb-4 font-khmer-content">
                {error}
              </p>
              <button
                onClick={loadPrices}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
              >
                ព្យាយាមម្តងទៀត
              </button>
            </div>
          ) : filteredPrices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                <Store />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-khmer-content">
                មិនមានទិន្នន័យតម្លៃទីផ្សារ
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      ល.រ
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      ផលិតផល
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      ទីផ្សារ
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      តម្លៃ
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      កាលបរិច្ឆេទ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPrices.map((price, index) => (
                    <tr
                      key={price.PriceID}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white font-khmer-content">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white font-khmer-content">
                          {price.ProductName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-khmer-content">
                          {price.MarketName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400 font-khmer-content">
                          {formatPrice(price.Price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-khmer-content">
                          {formatDate(price.PriceDate)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-khmer-content">
            ចង់ឃើញទិន្នន័យពេញលេញ?
          </p>
          <button
            onClick={loadPrices}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            អាប់ដេតទិន្នន័យ
          </button>
        </div>
      </div>
    </div>
  );
}
