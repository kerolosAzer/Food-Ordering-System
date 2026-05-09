import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getDeliveriesByDeliveryUserId,
  updateDeliveryStatus,
} from "../api/deliveryApi";
import { updateOrderStatus } from "../api/orderApi";

function DeliveryOrders() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const user = JSON.parse(localStorage.getItem("user"));

  const getAllowedStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "ASSIGNED":
        return [
          { value: "ASSIGNED", label: "Assigned" },
          { value: "PICKED_UP", label: "Picked Up" },
          { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
          { value: "FAILED", label: "Failed" },
        ];

      case "PICKED_UP":
        return [
          { value: "PICKED_UP", label: "Picked Up" },
          { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
          { value: "FAILED", label: "Failed" },
        ];

      case "OUT_FOR_DELIVERY":
        return [
          { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
          { value: "DELIVERED", label: "Delivered" },
          { value: "FAILED", label: "Failed" },
        ];

      case "DELIVERED":
        return [{ value: "DELIVERED", label: "Delivered" }];

      case "FAILED":
        return [{ value: "FAILED", label: "Failed" }];

      default:
        return [{ value: currentStatus, label: currentStatus }];
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!user?.id) {
        setMessageType("error");
        setMessage("Please login first");
        return;
      }

      const data = await getDeliveriesByDeliveryUserId(user.id);
      setDeliveries(data);

      const statusMap = {};
      data.forEach((delivery) => {
        statusMap[delivery.id] = delivery.deliveryStatus;
      });

      setSelectedStatus(statusMap);
    } catch (error) {
      console.error(
        "Delivery orders error:",
        error.response?.data || error.message
      );
      setMessageType("error");
      setMessage("Failed to load assigned deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = (deliveryId, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [deliveryId]: status,
    }));
  };

  const handleUpdateDeliveryStatus = async (delivery) => {
    const newStatus = selectedStatus[delivery.id];

    if (!newStatus) {
      setMessageType("error");
      setMessage("Please select a delivery status");
      return;
    }

    if (newStatus === delivery.deliveryStatus) {
      setMessageType("error");
      setMessage("Please choose a different status before saving");
      return;
    }

    try {
      setActionLoadingId(delivery.id);
      setMessage("");

      await updateDeliveryStatus(delivery.id, newStatus);

      if (newStatus === "OUT_FOR_DELIVERY") {
        try {
          await updateOrderStatus(delivery.orderId, "OUT_FOR_DELIVERY");
        } catch (orderError) {
          console.warn(
            "Delivery status updated, but order status was not updated:",
            orderError.response?.data || orderError.message
          );
        }
      }

      if (newStatus === "DELIVERED") {
        try {
          await updateOrderStatus(delivery.orderId, "DELIVERED");
        } catch (orderError) {
          console.warn(
            "Delivery status updated, but order status was not updated:",
            orderError.response?.data || orderError.message
          );
        }
      }

      setMessageType("success");
      setMessage("Delivery status updated successfully");

      await fetchDeliveries();
    } catch (error) {
      console.error(
        "Update delivery status error:",
        error.response?.data || error.message
      );
      setMessageType("error");
      setMessage(
        error.response?.data?.message || "Failed to update delivery status"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

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

  const getNextStepText = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "Next: Picked Up or Out For Delivery";
      case "PICKED_UP":
        return "Next: Out For Delivery";
      case "OUT_FOR_DELIVERY":
        return "Next: Delivered";
      case "DELIVERED":
        return "Completed";
      case "FAILED":
        return "Failed";
      default:
        return "";
    }
  };

  const activeDeliveries = deliveries.filter(
    (delivery) =>
      delivery.deliveryStatus !== "DELIVERED" &&
      delivery.deliveryStatus !== "FAILED"
  );

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "DELIVERED"
  ).length;

  const outForDeliveryCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "OUT_FOR_DELIVERY"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-orange-600">
            My Assigned Deliveries
          </h2>
          <p className="text-gray-500 mt-2">
            View assigned orders and update delivery status step by step.
          </p>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-orange-600 font-semibold text-lg animate-pulse">
              Loading assigned deliveries...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Total Assigned</p>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {deliveries.length}
                </h2>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Active</p>
                <h2 className="text-3xl font-extrabold text-blue-600 mt-1">
                  {activeDeliveries.length}
                </h2>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Out For Delivery</p>
                <h2 className="text-3xl font-extrabold text-orange-600 mt-1">
                  {outForDeliveryCount}
                </h2>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm">Delivered</p>
                <h2 className="text-3xl font-extrabold text-green-600 mt-1">
                  {deliveredCount}
                </h2>
              </div>
            </div>

            {message && (
              <div
                className={`mb-6 text-center rounded-xl py-3 font-semibold ${
                  messageType === "success"
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                }`}
              >
                {message}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Assigned Orders
                  </h3>
                  <p className="text-sm text-gray-500">
                    Showing {deliveries.length} delivery assignments.
                  </p>
                </div>

                <button
                  onClick={fetchDeliveries}
                  className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                >
                  Refresh
                </button>
              </div>

              {deliveries.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  No deliveries assigned to you yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          Delivery ID
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          Current Status
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          Next Step
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          Assigned At
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          New Status
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...deliveries]
                        .sort((a, b) => Number(b.id) - Number(a.id))
                        .map((delivery) => {
                          const cannotUpdate =
                            delivery.deliveryStatus === "DELIVERED" ||
                            delivery.deliveryStatus === "FAILED";

                          const currentSelectedStatus =
                            selectedStatus[delivery.id] ||
                            delivery.deliveryStatus;

                          return (
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

                              <td className="px-6 py-4 text-gray-600 text-sm">
                                {getNextStepText(delivery.deliveryStatus)}
                              </td>

                              <td className="px-6 py-4 text-gray-600">
                                {delivery.assignedAt || "No date"}
                              </td>

                              <td className="px-6 py-4">
                                <select
                                  value={currentSelectedStatus}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      delivery.id,
                                      e.target.value
                                    )
                                  }
                                  disabled={cannotUpdate}
                                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white min-w-[190px] disabled:bg-gray-100"
                                >
                                  {getAllowedStatuses(
                                    delivery.deliveryStatus
                                  ).map((status) => (
                                    <option
                                      key={status.value}
                                      value={status.value}
                                    >
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="px-6 py-4">
                                <button
                                  onClick={() =>
                                    handleUpdateDeliveryStatus(delivery)
                                  }
                                  disabled={
                                    actionLoadingId === delivery.id ||
                                    cannotUpdate ||
                                    currentSelectedStatus ===
                                      delivery.deliveryStatus
                                  }
                                  className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:bg-orange-300 transition"
                                >
                                  {actionLoadingId === delivery.id
                                    ? "Saving..."
                                    : "Update"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DeliveryOrders;