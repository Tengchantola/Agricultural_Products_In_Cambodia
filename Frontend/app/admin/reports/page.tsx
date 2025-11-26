"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PriceTrend,
  MarketStats,
  ProductStats,
  CategoryStats,
  ReportFilters,
} from "@/app/types/report";
import {
  getPriceTrends,
  getMarketStats,
  getProductStats,
  getCategoryStats,
  getAllPrices,
} from "@/app/lib/reports-api.ts";
import {
  Filter,
  TrendingUp,
  Building2,
  Package,
  Calendar,
  RefreshCw,
} from "lucide-react";
import Loading from "@/app/components/admin/Loading";
import Alert from "@/app/components/Alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  PieChart,
} from "recharts";
import { COLORS } from "@/app/data/color";
import { exportReport } from "@/app/utils/exportReport";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeTab] = useState("overview");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats[]>([]);
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [availableMarkets, setAvailableMarkets] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    market: "all",
    product: "all",
    category: "all",
  });

  const loadAvailableMarkets = async () => {
    try {
      const prices = await getAllPrices();
      const markets = Array.from(
        new Set(prices.map((price) => price.MarketName))
      );
      setAvailableMarkets(markets);
    } catch (error) {
      console.error("Error loading markets:", error);
    }
  };

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [trends, markets, products, categories] = await Promise.all([
        getPriceTrends(filters),
        getMarketStats(filters),
        getProductStats(filters),
        getCategoryStats(filters),
      ]);
      setPriceTrends(trends);
      setMarketStats(markets);
      setProductStats(products);
      setCategoryStats(categories);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError("មិនអាចទាញយកទិន្នន័យរបាយការណ៍បាន");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReports();
    loadAvailableMarkets();
  }, [filters, loadReports]);

  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      setExporting(true);
      await exportReport(format, filters);
    } catch (error) {
      console.error("Export error:", error);
      setError("មិនអាចនាំចេញរបាយការណ៍បាន");
    } finally {
      setExporting(false);
    }
  };

  const formatPrice = (price: number) => {
    return (
      new Intl.NumberFormat("km-KH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price) + " ៛"
    );
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const priceTrendsChartData = priceTrends.map((trend) => ({
    date: new Date(trend.date).toLocaleDateString("km-KH", {
      month: "short",
      day: "numeric",
    }),
    price: trend.averagePrice,
    fullDate: new Date(trend.date).toLocaleDateString("km-KH"),
    productCount: trend.productCount,
  }));

  const categoryChartData = categoryStats.map((category) => ({
    name: category.category,
    value: category.productCount,
    averagePrice: category.averagePrice,
  }));

  const marketPriceChartData = marketStats.slice(0, 8).map((market) => ({
    name:
      market.marketName.length > 10
        ? market.marketName.substring(0, 10) + "..."
        : market.marketName,
    fullName: market.marketName,
    averagePrice: market.averagePrice,
    productCount: market.productCount,
  }));

  const totalProducts = productStats.reduce(
    (sum, product) => sum + product.marketCount,
    0
  );
  const totalMarkets = marketStats.length;
  const overallAveragePrice =
    marketStats.length > 0
      ? marketStats.reduce((sum, market) => sum + market.averagePrice, 0) /
        marketStats.length
      : 0;
  const totalDataPoints = priceTrends.reduce(
    (sum, trend) => sum + trend.productCount,
    0
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white font-khmer-content">
            {label}
          </p>
          <p className="text-green-600 dark:text-green-400 font-khmer-content">
            តម្លៃមធ្យម: {formatPrice(payload[0].value)}
          </p>
          {payload[0].payload.productCount && (
            <p className="text-blue-600 dark:text-blue-400 font-khmer-content">
              ចំនួនផលិតផល: {payload[0].payload.productCount}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white font-khmer-content">
            {payload[0].name}
          </p>
          <p className="text-blue-600 dark:text-blue-400 font-khmer-content">
            ចំនួនផលិតផល: {payload[0].value}
          </p>
          <p className="text-green-600 dark:text-green-400 font-khmer-content">
            តម្លៃមធ្យម: {formatPrice(payload[0].payload.averagePrice)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            របាយការណ៍ និងស្ថិតិ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            ទិន្នន័យស្ថិតិពិតពី API - អាប់ដេតថ្មីជានិច្ច
          </p>
        </div>
        <div className="flex xs:flex-row gap-3 justify-center sm:justify-end">
          <button
            onClick={loadReports}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center font-khmer-content disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            អាប់ដេតទិន្នន័យ
          </button>
          <select
            title="selectExport"
            className="bg-green-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-khmer-content disabled:opacity-50"
            onChange={(e) =>
              e.target.value &&
              handleExport(e.target.value as "pdf" | "excel" | "csv")
            }
            disabled={exporting}
            defaultValue=""
          >
            <option value="" disabled>
              នាំចេញរបាយការណ៍
            </option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
          {exporting && (
            <div className="flex items-center text-green-600 font-khmer-content">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-2"></div>
              កំពុងនាំចេញ...
            </div>
          )}
        </div>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
            តម្រៀបទិន្នន័យ
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ពីថ្ងៃ
            </label>
            <input
              title="inputDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ដល់ថ្ងៃ
            </label>
            <input
              title="inputDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ទីផ្សារ
            </label>
            <select
              title="selectMarket"
              value={filters.market}
              onChange={(e) => handleFilterChange("market", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            >
              <option value="all">ទីផ្សារទាំងអស់</option>
              {availableMarkets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ប្រភេទផលិតផល
            </label>
            <select
              title="selectCategory"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            >
              <option value="all">ប្រភេទទាំងអស់</option>
              {categoryStats.map((category) => (
                <option key={category.category} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
          ទិន្នន័យពី {filters.startDate} ដល់ {filters.endDate} •{" "}
          {totalDataPoints} ទិន្នន័យ • {totalMarkets} ទីផ្សារ •{" "}
          {productStats.length} ផលិតផល
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ... Your existing stat cards remain the same ... */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                    ផលិតផលសរុប
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                    ទីផ្សារសកម្ម
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalMarkets}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                    តម្លៃមធ្យម
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(overallAveragePrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                    ចំនួនទិន្នន័យ
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalDataPoints}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-khmer-heading">
                តម្លៃមធ្យមប្រចាំថ្ងៃ
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceTrendsChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      tick={{ fill: "currentColor" }}
                    />
                    <YAxis
                      fontSize={12}
                      tick={{ fill: "currentColor" }}
                      tickFormatter={(value) =>
                        formatPrice(value).replace(" ៛", "")
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="price"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      name="តម្លៃមធ្យម"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-khmer-heading">
                ការចែកចាយតាមប្រភេទ
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-khmer-heading">
              តម្លៃមធ្យមតាមទីផ្សារ
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketPriceChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: "currentColor" }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "currentColor" }}
                    tickFormatter={(value) =>
                      formatPrice(value).replace(" ៛", "")
                    }
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-900 dark:text-white font-khmer-content">
                              {data.fullName}
                            </p>
                            <p className="text-green-600 dark:text-green-400 font-khmer-content">
                              តម្លៃមធ្យម: {formatPrice(data.averagePrice)}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 font-khmer-content">
                              ផលិតផល: {data.productCount}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="averagePrice"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="តម្លៃមធ្យម"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-khmer-heading">
              សកម្មភាពថ្មីៗ
            </h3>
            <div className="space-y-3">
              {marketStats.slice(0, 5).map((market, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white font-khmer-content">
                      {market.marketName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
                      {market.productCount} ផលិតផល
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400 font-khmer-content">
                      {formatPrice(market.averagePrice)}
                    </p>
                    <p
                      className={`text-sm ${
                        market.priceChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-khmer-content`}
                    >
                      {formatPercentage(market.priceChange)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
