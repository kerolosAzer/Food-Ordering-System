import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getDeliveriesByDeliveryUserId } from "../api/deliveryApi";

function DeliveryDashboard() {
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!user?.id) {
        setMessage("Please login first");
        return;
      }

      const data = await getDeliveriesByDeliveryUserId(user.id);
      setDeliveries(data);
    } catch (error) {
      console.error(
        "Delivery dashboard error:",
        error.response?.data || error.message
      );
      setMessage("Failed to load delivery dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "text-blue-700 bg-blue-100";
      case "PICKED_UP":
        return "text-purple-700 bg-purple-100";
      case "OUT_FOR_DELIVERY":
        return "text-orange-700 bg-orange-100";
      case "DELIVERED":
        return "text-green-700 bg-green-100";
      case "FAILED":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const totalAssigned = deliveries.length;

  const activeDeliveries = deliveries.filter(
    (delivery) =>
      delivery.deliveryStatus !== "DELIVERED" &&
      delivery.deliveryStatus !== "FAILED"
  ).length;

  const assignedCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "ASSIGNED"
  ).length;

  const pickedUpCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "PICKED_UP"
  ).length;

  const outForDeliveryCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "OUT_FOR_DELIVERY"
  ).length;

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "DELIVERED"
  ).length;

  const failedCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "FAILED"
  ).length;

  const latestDeliveries = [...deliveries]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  const stats = [
    {
      title: "Total Assigned",
      value: totalAssigned,
      icon: "📦",
      color: "text-gray-900",
      bg: "bg-gray-50",
    },
    {
      title: "Active",
      value: activeDeliveries,
      icon: "🚚",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Assigned",
      value: assignedCount,
      icon: "📝",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Picked Up",
      value: pickedUpCount,
      icon: "📍",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Out For Delivery",
      value: outForDeliveryCount,
      icon: "🛵",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Delivered",
      value: deliveredCount,
      icon: "✅",
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-orange-600 font-bold mb-2">
            Welcome {user?.name || "Delivery User"} 👋
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Delivery Dashboard
              </h1>
              <p className="text-gray-500 mt-2">
                Track your assigned orders and update delivery operations.
              </p>
            </div>

            <button
              onClick={() => navigate("/delivery/orders")}
              className="bg-orange-600 text-white px-7 py-4 rounded-xl font-bold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition"
            >
              View My Deliveries
            </button>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[350px] flex items-center justify-center">
            <p className="text-orange-600 font-semibold text-lg animate-pulse">
              Loading delivery dashboard...
            </p>
          </div>
        ) : (
          <>
            {message && (
              <div className="mb-6 text-center rounded-xl py-3 font-semibold text-red-700 bg-red-100">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {stat.title}
                      </p>
                      <h2 className={`text-3xl font-extrabold mt-2 ${stat.color}`}>
                        {stat.value}
                      </h2>
                    </div>

                    <div
                      className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center text-2xl`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Latest Assigned Deliveries
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your most recent delivery assignments.
                    </p>
                  </div>

                  <button
                    onClick={fetchDeliveries}
                    className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-xl font-bold hover:bg-orange-50 transition"
                  >
                    Refresh
                  </button>
                </div>

                {latestDeliveries.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    No deliveries assigned to you yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-sm font-bold text-gray-600">
                            Delivery
                          </th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-600">
                            Order
                          </th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-600">
                            Status
                          </th>
                          <th className="px-6 py-4 text-sm font-bold text-gray-600">
                            Assigned At
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {latestDeliveries.map((delivery) => (
                          <tr
                            key={delivery.id}
                            className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                          >
                            <td className="px-6 py-4 font-bold text-gray-800">
                              #{delivery.id}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              Order #{delivery.orderId}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                                  delivery.deliveryStatus
                                )}`}
                              >
                                {delivery.deliveryStatus}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {delivery.assignedAt || "No date"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Delivery Progress
                </h3>

                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <p className="text-sm text-blue-700 font-semibold">
                      Assigned
                    </p>
                    <p className="text-3xl font-extrabold text-blue-700 mt-1">
                      {assignedCount}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4">
                    <p className="text-sm text-purple-700 font-semibold">
                      Picked Up
                    </p>
                    <p className="text-3xl font-extrabold text-purple-700 mt-1">
                      {pickedUpCount}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-4">
                    <p className="text-sm text-orange-700 font-semibold">
                      Out For Delivery
                    </p>
                    <p className="text-3xl font-extrabold text-orange-700 mt-1">
                      {outForDeliveryCount}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <p className="text-sm text-green-700 font-semibold">
                      Delivered
                    </p>
                    <p className="text-3xl font-extrabold text-green-700 mt-1">
                      {deliveredCount}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-4">
                    <p className="text-sm text-red-700 font-semibold">
                      Failed
                    </p>
                    <p className="text-3xl font-extrabold text-red-700 mt-1">
                      {failedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DeliveryDashboard;