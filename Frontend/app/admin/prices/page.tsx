"use client";

import { useState, useEffect } from "react";
import {
  getMarketPrices,
  createPrice,
  updatePrice,
  deletePrice,
  PriceFormData,
} from "@/app/lib/prices-api";
import { MarketPrice, Markets } from "@/app/types/market";
import { Product } from "@/app/types/product";
import { getProducts } from "@/app/lib/products-api.ts";
import {
  CircleDollarSign,
  Edit,
  Package,
  RefreshCw,
  Store,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Save,
} from "lucide-react";
import Loading from "@/app/components/admin/Loading";
import Alert from "@/app/components/Alert";
import { formatPrice } from "@/app/utils/formatPrice";
import { formatDate } from "@/app/utils/formatDate";
import { getMarkets } from "@/app/lib/markets-api";

export default function PriceManagement() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [markets, setMarkets] = useState<Markets[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState<MarketPrice | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedMarket, setSelectedMarket] = useState<number>(0);
  const [dateFilter, setDateFilter] = useState("");
  const [formData, setFormData] = useState<PriceFormData>({
    Price: 0,
    PriceDate: new Date().toISOString().split("T")[0],
    Product: 0,
    Market: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prices, searchTerm, selectedProduct, selectedMarket, dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const [pricesData, productsData, marketsData] = await Promise.all([
        getMarketPrices(),
        getProducts(),
        getMarkets(),
      ]);
      const totalPriceValue = pricesData.reduce(
        (sum, item) => sum + Number(item.Price),
        0
      );
      setTotalPrice(totalPriceValue);
      setPrices(pricesData);
      setProducts(productsData);
      setMarkets(marketsData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("មិនអាចទាញយកទិន្នន័យបាន");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = prices;
    if (searchTerm) {
      filtered = filtered.filter(
        (price) =>
          price.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.MarketName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedProduct > 0) {
      filtered = filtered.filter((price) => price.Product === selectedProduct);
    }
    if (selectedMarket > 0) {
      filtered = filtered.filter((price) => price.Market === selectedMarket);
    }
    if (dateFilter) {
      filtered = filtered.filter((price) => price.PriceDate === dateFilter);
    }
    setFilteredPrices(filtered);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || selectedProduct > 0 || selectedMarket > 0 || dateFilter;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrices = filteredPrices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "Price"
          ? parseFloat(value)
          : name === "Product" || name === "Market"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    if (
      !formData.Product ||
      !formData.Market ||
      !formData.Price ||
      !formData.PriceDate
    ) {
      setError("សូមបំពេញព័ត៌មានគ្រប់ផ្នែក");
      setFormLoading(false);
      return;
    }
    try {
      if (editingPrice) {
        await updatePrice(editingPrice.PriceID, formData);
        setSuccess("កែសម្រួលតម្លៃបានដោយជោគជ័យ!");
      } else {
        await createPrice(formData);
        setSuccess("បង្កើតតម្លៃបានដោយជោគជ័យ!");
      }
      await loadData();
      resetForm();
      setCurrentPage(1);
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("Error saving price:", error);
      setError("មិនអាចរក្សាទុកតម្លៃបានទេ");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Price: 0,
      PriceDate: new Date().toISOString().split("T")[0],
      Product: 0,
      Market: 0,
    });
    setShowAddForm(false);
    setEditingPrice(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (price: MarketPrice) => {
    setFormData({
      Price: parseFloat(price.Price),
      PriceDate: price.PriceDate,
      Product: price.Product,
      Market: price.Market,
    });
    setEditingPrice(price);
    setShowAddForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (priceId: number) => {
    if (confirm("តើអ្នកពិតជាចង់លុបតម្លៃនេះមែនឬ?")) {
      try {
        await deletePrice(priceId);
        await loadData();
        setSuccess("អ្នកបានលុបតម្លៃបានដោយជោគជ័យ!");
        if (currentPrices.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting price:", error);
        setError("មិនអាចលុបតម្លៃបាន");
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            គ្រប់គ្រងតម្លៃ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            គ្រប់គ្រងតម្លៃផលិតផលកសិកម្មនៅទីផ្សារផ្សេងៗ
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
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center font-khmer-content"
          >
            <Save className="w-4 h-4 mr-2" />
            បន្ថែមតម្លៃថ្មី
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <CircleDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                តម្លៃសរុប
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(totalPrice.toString())}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                ផលិតផល
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {products.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                ទីផ្សារ
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {markets.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <RefreshCw className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                អាប់ដេតចុងក្រោយ
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {prices.length > 0 ? formatDate(prices[0].PriceDate) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ស្វែងរកផលិតផល
            </label>
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="វាយឈ្មោះផលិតផល ឬទីផ្សារ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ផលិតផល
            </label>
            <select
              title="selectProduct"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            >
              <option value={0}>ផលិតផលទាំងអស់</option>
              {products.map((product) => (
                <option key={product.ProductID} value={product.ProductID}>
                  {product.ProductName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ទីផ្សារ
            </label>
            <select
              title="selectMarket"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            >
              <option value={0}>ទីផ្សារទាំងអស់</option>
              {markets.map((market) => (
                <option key={market.MarketID} value={market.MarketID}>
                  {market.MarketName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              កាលបរិច្ឆេទ
            </label>
            <input
              title="inputDate"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
          បានរកឃើញ {filteredPrices.length} តម្លៃ
          {hasActiveFilters && " ត្រូវតាមលក្ខខណ្ឌតម្រង"}
        </div>
      </div>

      {(showAddForm || editingPrice) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              {editingPrice ? "កែសម្រួលតម្លៃ" : "បង្កើតតម្លៃថ្មី"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
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

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                ផលិតផល <span className="text-red-600">*</span>
              </label>
              <select
                title="selectProduct"
                name="Product"
                value={formData.Product}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              >
                <option value={0}>ជ្រើសរើសផលិតផល</option>
                {products.map((product) => (
                  <option key={product.ProductID} value={product.ProductID}>
                    {product.ProductName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                ទីផ្សារ <span className="text-red-600">*</span>
              </label>
              <select
                title="selectMarket"
                name="Market"
                value={formData.Market}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              >
                <option value={0}>ជ្រើសរើសទីផ្សារ</option>
                {markets.map((market) => (
                  <option key={market.MarketID} value={market.MarketID}>
                    {market.MarketName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                តម្លៃ (៛) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleInputChange}
                required
                min="0"
                step="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                កាលបរិច្ឆេទ <span className="text-red-600">*</span>
              </label>
              <input
                title="inputDate"
                type="date"
                name="PriceDate"
                value={formData.PriceDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="md:col-span-4 flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-khmer-content"
              >
                {formLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    កំពុងរក្សាទុក...
                  </div>
                ) : editingPrice ? (
                  "រក្សាទុកការផ្លាស់ប្តូរ"
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    <span>បន្ថែមតម្លៃថ្មី</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-khmer-content"
              >
                បោះបង់
              </button>
            </div>
          </form>
        </div>
      )}

      {error && !showAddForm && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {success && !showAddForm && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {currentPrices.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-khmer-content">
              {hasActiveFilters
                ? "មិនមានតម្លៃត្រូវតាមលក្ខខណ្ឌតម្រៀបឡើយ"
                : "មិនទាន់មានតម្លៃ"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
              >
                <Save className="w-4 h-4 mr-2" />
                បន្ថែមតម្លៃដំបូង
              </button>
            )}
          </div>
        ) : (
          <>
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
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      សកម្មភាព
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentPrices.map((price, index) => (
                    <tr
                      key={price.PriceID}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {indexOfFirstItem + index + 1}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(price)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer flex flex-row dark:text-blue-400 dark:hover:text-blue-300 font-khmer-content"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            កែសម្រួល
                          </button>
                          <button
                            onClick={() => handleDelete(price.PriceID)}
                            className="text-red-600 hover:text-red-900 cursor-pointer flex flex-row dark:text-red-400 dark:hover:text-red-300 font-khmer-content"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            លុប
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-khmer-content">
                    បានបង្ហាញ {currentPrices.length} នៃ {filteredPrices.length}{" "}
                    តម្លៃ (ទំព័រ {currentPage} នៃ {totalPages})
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      title="btnGoPrev"
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-green-600 text-white"
                                : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                    <button
                      title="btnGoNext"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
