"use client";

import { useState, useEffect } from "react";
import { MarketPrice } from "../types/market";
import { getMarketPrices } from "../lib/api";
import {
  Package,
  Store,
  BarChart2,
  User,
  ArrowDownCircle,
  PlusCircle,
  RefreshCw,
  CircleDollarSign,
  Plus,
} from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import Loading from "../components/admin/Loading";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPrices: 0,
    totalProducts: 0,
    totalMarkets: 0,
    todayUpdates: 0,
  });
  const [recentPrices, setRecentPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getMarketPrices();
      const today = new Date().toISOString().split("T")[0];
      setStats({
        totalPrices: data.reduce((sum, item) => sum + Number(item.Price), 0),
        totalProducts: new Set(data.map((p) => p.Product)).size,
        totalMarkets: new Set(data.map((p) => p.Market)).size,
        todayUpdates: data.filter((price) => {
          return price.PriceDate === today;
        }).length,
      });
      setRecentPrices(data.slice(0, 5));
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            ផ្ទាំងគ្រប់គ្រង
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            ទិន្នន័យសរុប និងស្ថិតិរបស់ប្រព័ន្ធ
          </p>
        </div>
        <div className="flex xs:flex-row gap-3 justify-center sm:justify-end">
          <button
            onClick={loadData}
            className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center font-khmer-content"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            អាប់ដេតទិន្នន័យ
          </button>
          {/* <button
            // onClick={() => setShowAddForm(true)}
            className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center font-khmer-content"
          >
            <Plus className="w-4 h-4 mr-2" />
            បន្ថែមតម្លៃថ្មី
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CircleDollarSign className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                តម្លៃសរុប
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(`${stats.totalPrices}`)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Package className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                ផលិតផល
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Store className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                ទីផ្សារ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalMarkets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <RefreshCw className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                អាប់ដេតថ្ងៃនេះ
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.todayUpdates}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              តម្លៃថ្មីៗ
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPrices.map((price) => (
                <div
                  key={price.PriceID}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white font-khmer-content">
                      {price.ProductName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
                      {price.MarketName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400 font-khmer-content">
                      {formatPrice(price.Price)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {price.PriceDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-khmer-content">
              មើលទាំងអស់
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              សកម្មភាពរហ័ស
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-center">
                <div className="flex justify-center items-center mb-2">
                  <PlusCircle className="text-blue-700" />
                </div>
                <p className="font-medium text-blue-700 dark:text-blue-300 font-khmer-content">
                  បន្ថែមតម្លៃ
                </p>
              </button>
              <button className="p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors text-center">
                <div className="flex justify-center items-center mb-2">
                  <ArrowDownCircle className="text-green-700" />
                </div>
                <p className="font-medium text-green-700 dark:text-green-300 font-khmer-content">
                  នាំចូល
                </p>
              </button>
              <button className="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors text-center">
                <div className="flex justify-center items-center mb-2">
                  <BarChart2 className="text-orange-700" />
                </div>
                <p className="font-medium text-orange-700 dark:text-orange-300 font-khmer-content">
                  របាយការណ៍
                </p>
              </button>
              <button className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors text-center">
                <div className="flex justify-center items-center mb-2">
                  <User className="text-purple-700" />
                </div>
                <p className="font-medium text-purple-700 dark:text-purple-300 font-khmer-content">
                  អ្នកប្រើ
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
            ស្ថានភាពប្រព័ន្ធ
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-900 dark:text-white font-khmer-content">
                API ស្ថានភាព
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-khmer-content">
                ដំណើរការ
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-900 dark:text-white font-khmer-content">
                ទិន្នន័យ
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-khmer-content">
                អាប់ដេត
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-900 dark:text-white font-khmer-content">
                សុវត្ថិភាព
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-khmer-content">
                ធានា
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
