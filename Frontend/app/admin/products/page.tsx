"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/app/lib/products-api.ts";
import { Product } from "@/app/types/product";
import { ProductFormData } from "@/app/types/product";
import Loading from "@/app/components/admin/Loading";
import Alert from "@/app/components/Alert";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState<ProductFormData>({
    ProductName: "",
    Category: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("មិនអាចទាញយកទិន្នន័យផលិតផលបាន");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.ProductID, formData);
        setSuccess("កែសម្រួលផលិតផលបានដោយជោគជ័យ!");
      } else {
        await createProduct(formData);
        setSuccess("បង្កើតផលិតផលបានដោយជោគជ័យ!");
      }
      await loadProducts();
      resetForm();
      setCurrentPage(1);
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("មិនអាចរក្សាទុកផលិតផលបានទេ");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ProductName: "",
      Category: "",
    });
    setShowForm(false);
    setEditingProduct(null);
    setError("");
  };

  const handleEdit = (product: Product) => {
    setFormData({
      ProductName: product.ProductName,
      Category: product.Category,
    });
    setEditingProduct(product);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (productId: number) => {
    if (confirm("តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនឬ?")) {
      try {
        await deleteProduct(productId);
        await loadProducts();
        setSuccess("អ្នកបានលុបផលិតផលបានដោយជោគជ័យ!");
        if (currentProducts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("មិនអាចលុបផលិតផលបាន");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.ProductName.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
    const matchesCategory =
      categoryFilter === "all" || product.Category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const categories = Array.from(new Set(products.map((p) => p.Category)));

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

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, categoryFilter]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            គ្រប់គ្រងផលិតផល
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            គ្រប់គ្រងផលិតផលកសិកម្មទាំងអស់ក្នុងប្រព័ន្ធ
          </p>
        </div>
        <div className="flex xs:flex-row gap-3 justify-center sm:justify-end">
          <button
            onClick={loadProducts}
            className="bg-gray-500 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center font-khmer-content"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            អាប់ដេតទិន្នន័យ
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center font-khmer-content"
          >
            <Save className="w-4 h-4 mr-2" />
            បន្ថែមផលិតផល
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                ផលិតផលសរុប
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {products.length}
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
                ប្រភេទផលិតផល
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                ផលិតផលបានតម្រៀប
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredProducts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(showForm || editingProduct) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white font-khmer-heading">
              {editingProduct ? "កែសម្រួលផលិតផល" : "បន្ថែមផលិតផលថ្មី"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ឈ្មោះផលិតផល <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="ProductName"
                  value={formData.ProductName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                  placeholder="បញ្ចូលឈ្មោះផលិតផល..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
                  ប្រភេទ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  required
                  placeholder="បញ្ចូលប្រភេទ…"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-green-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-khmer-content"
              >
                {formLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    កំពុងរក្សាទុក...
                  </div>
                ) : editingProduct ? (
                  "រក្សាទុកការផ្លាស់ប្តូរ"
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    <span>បន្ថែមផលិតផល</span>
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-khmer-content"
              >
                បោះបង់
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ស្វែងរកផលិតផល
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="វាយឈ្មោះផលិតផល..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              តម្រៀបតាមប្រភេទ
            </label>
            <select
              title="selectCategory"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            >
              <option value="all">ប្រភេទទាំងអស់</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
              បានរកឃើញ {filteredProducts.length} ផលិតផល
            </p>
          </div>
        </div>
      </div>

      {error && !showForm && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-khmer-content">
              {searchTerm || categoryFilter !== "all"
                ? "មិនមានផលិតផលត្រូវតាមលក្ខខណ្ឌតម្រៀបឡើយ"
                : "មិនទាន់មានផលិតផល"}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-khmer-content"
              >
                <Save className="w-4 h-4 mr-2" />
                បន្ថែមផលិតផលដំបូង
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
                      ឈ្មោះផលិតផល
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      ប្រភេទ
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      សកម្មភាព
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentProducts.map((product, index) => (
                    <tr
                      key={product.ProductID}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {indexOfFirstItem + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white font-khmer-content">
                          {product.ProductName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-khmer-content">
                          {product.Category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer dark:text-blue-400 dark:hover:text-blue-300 flex items-center font-khmer-content"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            កែសម្រួល
                          </button>
                          <button
                            onClick={() => handleDelete(product.ProductID)}
                            className="text-red-600 hover:text-red-900 cursor-pointer dark:text-red-400 dark:hover:text-red-300 flex items-center font-khmer-content"
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

            {totalPages >= 1 && (
              <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-khmer-content">
                    បានបង្ហាញ {currentProducts.length} នៃ{" "}
                    {filteredProducts.length} ផលិតផល (ទំព័រ {currentPage} នៃ{" "}
                    {totalPages})
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
