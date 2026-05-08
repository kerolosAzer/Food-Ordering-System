import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAllUsers } from "../api/userApi";
import { getAllOrders } from "../api/orderApi";
import { getAllRestaurants } from "../api/restaurantApi";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [usersData, ordersData, restaurantsData] = await Promise.all([
        getAllUsers(),
        getAllOrders(),
        getAllRestaurants(),
      ]);

      setUsers(usersData);
      setOrders(ordersData);
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error.response?.data || error.message
      );
      setMessage("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "CANCELLED"
  ).length;

  const deliveryUsers = users.filter((user) => user.role === "DELIVERY").length;

  const totalSales = orders
    .filter((order) => order.orderStatus !== "CANCELLED")
    .reduce((total, order) => total + Number(order.totalPrice || 0), 0);

  const latestOrders = [...orders]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 6);

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: "👥",
      bg: "bg-orange-50",
    },
    {
      title: "Restaurants",
      value: restaurants.length,
      icon: "🏪",
      bg: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: "📦",
      bg: "bg-purple-50",
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: "⏱️",
      bg: "bg-yellow-50",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: "✅",
      bg: "bg-green-50",
    },
    {
      title: "Delivery Users",
      value: deliveryUsers,
      icon: "🚚",
      bg: "bg-orange-50",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-700 bg-yellow-100";
      case "CONFIRMED":
        return "text-blue-700 bg-blue-100";
      case "PREPARING":
        return "text-purple-700 bg-purple-100";
      case "OUT_FOR_DELIVERY":
        return "text-orange-700 bg-orange-100";
      case "DELIVERED":
        return "text-green-700 bg-green-100";
      case "CANCELLED":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getPaymentStyle = (paymentStatus) => {
    switch (paymentStatus) {
      case "PAID":
        return "text-green-700 bg-green-100";
      case "UNPAID":
        return "text-yellow-700 bg-yellow-100";
      case "FAILED":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-orange-600 font-semibold text-lg animate-pulse">
            Loading dashboard data...
          </p>
        </div>
      ) : (
        <>
          {message && (
            <div className="mb-6 text-center text-red-700 bg-red-100 rounded-xl py-3 font-semibold">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">
                      {stat.title}
                    </p>

                    <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
                      {stat.value}
                    </h3>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center text-2xl shrink-0`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Quick Actions
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Navigate quickly to the main admin operations.
                </p>
              </div>

              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold">
                Total Sales: {totalSales} EGP
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
              <button
                onClick={() => navigate("/admin/add-restaurant")}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">🏪</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Add Restaurant
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Create a new restaurant.
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/add-menu-item")}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">🍕</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Add Menu Item
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Add food items.
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/restaurants")}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Restaurants
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Manage restaurants.
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/orders")}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Orders
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Manage all orders.
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/assign-delivery")}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-lg font-bold text-gray-900">
                  Assign Delivery
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Assign orders.
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/logs")}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="text-4xl mb-4">🧾</div>
                <h3 className="text-lg font-bold text-gray-900">
                  System Logs
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  View AOP logs.
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Cancelled Orders</p>
              <h2 className="text-3xl font-extrabold text-red-600 mt-1">
                {cancelledOrders}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Paid Orders</p>
              <h2 className="text-3xl font-extrabold text-green-600 mt-1">
                {orders.filter((o) => o.paymentStatus === "PAID").length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Unpaid Orders</p>
              <h2 className="text-3xl font-extrabold text-yellow-600 mt-1">
                {orders.filter((o) => o.paymentStatus === "UNPAID").length}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Latest Orders
                </h3>
                <p className="text-sm text-gray-500">
                  Real orders created in the system
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="text-orange-600 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            {latestOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No orders created yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Customer ID
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Restaurant ID
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Total
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Payment Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Order Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          #{order.id}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {order.customerId}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {order.restaurantId}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {order.totalPrice} EGP
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {order.paymentMethod}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStyle(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;