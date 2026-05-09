import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus } from "../api/orderApi";
import { getAllUsers } from "../api/userApi";
import { assignDelivery, getAllDeliveries } from "../api/deliveryApi";

function AdminAssignDelivery() {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [ordersData, usersData, deliveriesData] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
        getAllDeliveries(),
      ]);

      setOrders(ordersData);
      setDeliveries(deliveriesData);

      const deliveryOnly = usersData.filter((user) => user.role === "DELIVERY");
      setDeliveryUsers(deliveryOnly);
    } catch (error) {
      console.error(
        "Assign delivery page error:",
        error.response?.data || error.message
      );
      setMessageType("error");
      setMessage("Failed to load delivery assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignedOrderIds = deliveries.map((delivery) =>
    Number(delivery.orderId)
  );

  const assignableStatuses = ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY"];

  const assignableOrders = orders.filter((order) => {
    const isAlreadyAssigned = assignedOrderIds.includes(Number(order.id));
    const isValidStatus = assignableStatuses.includes(order.orderStatus);

    if (isAlreadyAssigned || !isValidStatus) {
      return false;
    }

    if (statusFilter === "ALL") {
      return true;
    }

    return order.orderStatus === statusFilter;
  });

  const sortedOrders = [...assignableOrders].sort(
    (a, b) => Number(b.id) - Number(a.id)
  );

  const handleSelectUser = (orderId, deliveryUserId) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [orderId]: deliveryUserId,
    }));
  };

  const getSelectedDeliveryUser = (orderId) => {
    const selectedId = selectedUsers[orderId];

    return deliveryUsers.find(
      (user) => Number(user.id) === Number(selectedId)
    );
  };

  const handleAssignDelivery = async (order) => {
    const deliveryUser = getSelectedDeliveryUser(order.id);

    if (!deliveryUser) {
      setMessageType("error");
      setMessage("Please select a delivery user first");
      return;
    }

    try {
      setActionLoadingId(order.id);
      setMessage("");

      const deliveryData = {
        orderId: Number(order.id),
        deliveryUserId: Number(deliveryUser.id),
        deliveryUserName: deliveryUser.name,
      };

      await assignDelivery(deliveryData);

      if (order.orderStatus === "CONFIRMED" || order.orderStatus === "PREPARING") {
        try {
          await updateOrderStatus(order.id, "OUT_FOR_DELIVERY");
        } catch (statusError) {
          console.warn(
            "Delivery assigned, but order status was not updated:",
            statusError.response?.data || statusError.message
          );
        }
      }

      setMessageType("success");
      setMessage(
        `Order #${order.id} assigned to ${deliveryUser.name} successfully`
      );

      await fetchData();
    } catch (error) {
      console.error("Assign delivery error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(
        error.response?.data?.message || "Failed to assign delivery user"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
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
      case "PENDING":
        return "text-yellow-700 bg-yellow-100";
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

  const totalAssigned = deliveries.length;
  const assignedCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "ASSIGNED"
  ).length;
  const outForDeliveryCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "OUT_FOR_DELIVERY"
  ).length;
  const deliveredCount = deliveries.filter(
    (delivery) => delivery.deliveryStatus === "DELIVERED"
  ).length;

  return (
    <AdminLayout title="Assign Delivery">
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-orange-600 font-semibold text-lg animate-pulse">
            Loading delivery assignments...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Total Deliveries</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                {totalAssigned}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Assigned</p>
              <h2 className="text-3xl font-extrabold text-blue-600 mt-1">
                {assignedCount}
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Orders Ready for Delivery Assignment
                </h3>
                <p className="text-sm text-gray-500">
                  Showing {sortedOrders.length} orders that are not assigned yet.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="ALL">All Assignable</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                </select>

                <button
                  onClick={fetchData}
                  className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            {deliveryUsers.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-red-600 font-bold">
                  No delivery users found.
                </p>
                <p className="text-gray-500 mt-2">
                  Add a user with role DELIVERY first from user management.
                </p>
              </div>
            ) : sortedOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No assignable orders found. Confirm an order first from Manage
                Orders.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Order
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Restaurant
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Total
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Delivery User
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                      >
                        <td className="px-6 py-4 font-bold text-gray-800">
                          #{order.id}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          Customer #{order.customerId}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          Restaurant #{order.restaurantId}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-gray-700">
                              {order.paymentMethod}
                            </span>
                            <span
                              className={`w-fit px-3 py-1 rounded-full text-xs font-bold ${getPaymentStyle(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
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

                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {order.totalPrice} EGP
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={selectedUsers[order.id] || ""}
                            onChange={(e) =>
                              handleSelectUser(order.id, e.target.value)
                            }
                            className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white min-w-[180px]"
                          >
                            <option value="">Select delivery user</option>
                            {deliveryUsers.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name} - #{user.id}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleAssignDelivery(order)}
                            disabled={actionLoadingId === order.id}
                            className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 disabled:bg-orange-300 transition"
                          >
                            {actionLoadingId === order.id
                              ? "Assigning..."
                              : "Assign"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Current Delivery Assignments
              </h3>
              <p className="text-sm text-gray-500">
                Orders already assigned to delivery users.
              </p>
            </div>

            {deliveries.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No delivery assignments yet.
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
                        Delivery User
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
                    {[...deliveries]
                      .sort((a, b) => Number(b.id) - Number(a.id))
                      .map((delivery) => (
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

                          <td className="px-6 py-4 text-gray-600">
                            {delivery.deliveryUserName || "Unknown"} #
                            {delivery.deliveryUserId}
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
        </>
      )}
    </AdminLayout>
  );
}

export default AdminAssignDelivery;