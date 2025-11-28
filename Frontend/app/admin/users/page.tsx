"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  RefreshCw,
  Trash2,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import Loading from "@/app/components/admin/Loading";
import { UserData } from "@/app/types/user-data";
import Alert from "@/app/components/Alert";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://127.0.0.1:8000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("មិនអាចទាញយកទិន្នន័យអ្នកប្រើប្រាស់បាន");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm("តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះមែនឬ?")) {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to delete user");
        }
        const updatedUsers = users.filter((user) => user.id !== userId);
        setUsers(updatedUsers);
        if (currentUsers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setSuccess("បានលុបអ្នកប្រើប្រាស់ដោយជោគជ័យ!");
        setTimeout(() => setSuccess(""), 2000);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("មិនអាចលុបអ្នកប្រើប្រាស់បាន");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "inactive" && !user.is_active);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-khmer-heading">
            គ្រប់គ្រងអ្នកប្រើប្រាស់
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-khmer-content">
            គ្រប់គ្រងអ្នកប្រើប្រាស់ទាំងអស់ក្នុងប្រព័ន្ធ
          </p>
        </div>
        <div className="flex xs:flex-row gap-3 justify-center sm:justify-end">
          <button
            onClick={fetchUsers}
            className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center font-khmer-content"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            អាប់ដេតទិន្នន័យ
          </button>
          <button
            onClick={() => router.push("/admin/users/create")}
            className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center font-khmer-content"
          >
            <Save className="w-4 h-4 mr-2" />
            បន្ថែមអ្នកប្រើប្រាស់
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                អ្នកប្រើប្រាស់សរុប
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                អ្នកប្រើប្រាស់សកម្ម
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((user) => user.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                អ្នកប្រើប្រាស់អសកម្ម
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.filter((user) => !user.is_active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-medium font-medium text-gray-600 dark:text-gray-400 font-khmer-content">
                អ្នកប្រើប្រាស់បានតម្រៀប
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredUsers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              ស្វែងរកអ្នកប្រើប្រាស់
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ស្វែងរកតាមឈ្មោះ, អុីមែល..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-khmer-content">
              តម្រៀបតាមស្ថានភាព
            </label>
            <select
              title="selectStatus"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-khmer-content"
            >
              <option value="all">ស្ថានភាពទាំងអស់</option>
              <option value="active">សកម្ម</option>
              <option value="inactive">អសកម្ម</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-khmer-content">
              បានរកឃើញ {filteredUsers.length} អ្នកប្រើប្រាស់
            </p>
          </div>
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

      <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
        {currentUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-khmer-content">
              {searchTerm || statusFilter !== "all"
                ? "មិនមានអ្នកប្រើប្រាស់ត្រូវតាមលក្ខខណ្ឌតម្រៀបឡើយ"
                : "មិនទាន់មានអ្នកប្រើប្រាស់"}
            </p>
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
                      នាម
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      អុីមែល
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      ឈ្មោះពេញ
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      ស្ថានភាព
                    </th>
                    <th className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-khmer-content">
                      សកម្មភាព
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {indexOfFirstItem + index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white font-khmer-content">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-khmer-content">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-khmer-content">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {user.is_active ? "សកម្ម" : "អសកម្ម"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/users/edit/${user.id}`)
                            }
                            className="text-blue-600 hover:text-blue-900 cursor-pointer dark:text-blue-400 dark:hover:text-blue-300 flex items-center font-khmer-content"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            កែសម្រួល
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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
              <div className="bg-white dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-khmer-content">
                    បានបង្ហាញ {currentUsers.length} នៃ {filteredUsers.length}{" "}
                    អ្នកប្រើប្រាស់ (ទំព័រ {currentPage} នៃ {totalPages})
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
