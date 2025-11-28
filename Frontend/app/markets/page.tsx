"use client";

import { useState, useEffect } from "react";
import { getMarketPrices } from "../lib/api";
import { MarketData, MarketPrice } from "../types/market";
import Loading from "../components/Loading";
import { ArrowRight, CircleDollarSign, EyeIcon, Package } from "lucide-react";

export default function MarketsPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<number>(0);
  const [viewAllMode, setViewAllMode] = useState(false);

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
      setError("Failed to load market data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const marketData = prices.reduce<Record<string, MarketData>>(
    (acc, price: MarketPrice) => {
      if (!acc[price.MarketName]) {
        acc[price.MarketName] = {
          products: [],
          totalProducts: 0,
          averagePrice: 0,
        };
      }
      acc[price.MarketName].products.push(price);
      acc[price.MarketName].totalProducts++;
      acc[price.MarketName].averagePrice =
        acc[price.MarketName].products.reduce(
          (sum, p) => sum + Number(p.Price),
          0
        ) / acc[price.MarketName].totalProducts;
      return acc;
    },
    {}
  );

  Object.keys(marketData).forEach((market) => {
    const products = marketData[market].products;
    const total = products.reduce(
      (sum: number, product: MarketPrice) => sum + parseFloat(product.Price),
      0
    );
    marketData[market].averagePrice = total / products.length;
  });

  const formatPrice = (price: number) => {
    return (
      new Intl.NumberFormat("km-KH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price) + " ៛"
    );
  };

  const totalPrice = prices.reduce((sum, item) => {
    return sum + Number(item.Price);
  }, 0);

  const handleViewAll = (marketName: string) => {
    setSelectedMarket(marketName);
    setViewAllMode(true);
  };

  const handleBackToMarkets = () => {
    setViewAllMode(false);
    setSelectedMarket(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (viewAllMode && selectedMarket) {
    const marketProducts = marketData[selectedMarket]?.products || [];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToMarkets}
              className="flex items-center text-xl font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-khmer-content cursor-pointer"
            >
              <ArrowRight className="w-6 h-6 mr-2 rotate-180" />
              ត្រលប់ទៅទីផ្សារ
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
              ផលិតផលក្នុងទីផ្សារ
            </h1>
            <div className="w-20"></div>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading mb-2">
                  {selectedMarket}
                </h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Package className="w-5 h-5 mr-2 mb-1" />
                    <span className="font-khmer-content">
                      {marketProducts.length} ផលិតផល
                    </span>
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CircleDollarSign className="w-5 h-5 mr-2 mb-1" />
                    <span className="font-khmer-content">
                      តម្លៃមធ្យម:{" "}
                      {formatPrice(
                        marketData[selectedMarket]?.averagePrice || 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg font-khmer-content">
                ទីផ្សារសកម្ម
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketProducts.map((product: MarketPrice, index: number) => (
              <div
                key={product.PriceID}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white font-khmer-content text-lg">
                      {product.ProductName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-khmer-content mt-1">
                      កាលបរិច្ឆេទ:{" "}
                      {new Date(product.PriceDate).toLocaleDateString("km-KH")}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-khmer-content">
                    តម្លៃបច្ចុប្បន្ន:
                  </span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400 font-khmer-content">
                    {formatPrice(parseFloat(product.Price))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-khmer-heading mb-4">
            ទីផ្សារកសិកម្ម
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-khmer-content">
            ស្វែងយល់ពីទីផ្សារកសិកម្មចម្បងៗ និងតម្លៃផលិតផលរបស់ពួកគេ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
              ចំនួនទីផ្សារ
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-khmer-content">
              {Object.keys(marketData).length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
              ចំនួនតម្លៃសរុប
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-khmer-content">
              {formatPrice(totalPrice)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 text-center">
            <div className="text-lg text-gray-600 dark:text-gray-400 font-khmer-content">
              ប្រភេទផលិតផល
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-khmer-content">
              {new Set(prices.map((p) => p.Product)).size}
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-4 font-khmer-content">
              {error}
            </p>
            <button
              onClick={loadPrices}
              className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
            >
              ព្យាយាមម្តងទៀត
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(marketData).map(
              ([marketName, data]: [string, MarketData]) => (
                <div
                  key={marketName}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-khmer-content">
                      {marketName}
                    </h3>
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm px-3 py-1 rounded-full font-khmer-content">
                      {data.totalProducts} ផលិតផល
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400 font-khmer-content">
                        តម្លៃមធ្យម:
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400 font-khmer-content">
                        {formatPrice(data.averagePrice)}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 font-khmer-content">
                        ផលិតផលពេញនិយម:
                      </h4>
                      <div className="space-y-1">
                        {data.products
                          .slice(0, 3)
                          .map((product: MarketPrice) => (
                            <div
                              key={product.PriceID}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-600 dark:text-gray-400 font-khmer-content truncate flex-1">
                                {product.ProductName}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white ml-2 font-khmer-content">
                                {formatPrice(parseFloat(product.Price))}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewAll(marketName)}
                    className="w-full flex items-center justify-center gap-2 mt-4 cursor-pointer bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
                  >
                    <EyeIcon className="w-4 h-4" />
                    មើលតម្លៃទាំងអស់
                  </button>
                </div>
              )
            )}
          </div>
        )}

        <div className="mt-12 bg-white dark:bg-gray-700 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6 font-khmer-heading">
            ទីតាំងទីផ្សារ
          </h2>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
                ផែនទីទីតាំងទីផ្សារនឹងត្រូវបានបន្ថែមឆាប់ៗនេះ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
