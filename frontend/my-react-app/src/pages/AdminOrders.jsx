import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus, cancelOrder } from "../api/orderApi";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const orderStatusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PREPARING", label: "Preparing" },
    { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Admin orders error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const formatStatusLabel = (status) => {
    const found = orderStatusOptions.find((option) => option.value === status);
    return found ? found.label : status;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setMessage("");
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setNewStatus("");
  };

  const cannotUpdateSelectedOrder =
    selectedOrder?.orderStatus === "DELIVERED" ||
    selectedOrder?.orderStatus === "CANCELLED";

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    if (newStatus === selectedOrder.orderStatus) {
      setMessageType("error");
      setMessage("Please choose a different status before saving.");
      return;
    }

    try {
      setActionLoading(true);
      setMessage("");

      await updateOrderStatus(selectedOrder.id, newStatus);

      setMessageType("success");
      setMessage("Order status updated successfully");

      await fetchOrders();
      handleCloseModal();
    } catch (error) {
      console.error("Update status error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      setActionLoading(true);
      setMessage("");

      await cancelOrder(orderId);

      setMessageType("success");
      setMessage("Order cancelled successfully");

      await fetchOrders();
      handleCloseModal();
    } catch (error) {
      console.error("Cancel order error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => Number(b.id) - Number(a.id)
  );

  const pendingCount = orders.filter((o) => o.orderStatus === "PENDING").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "DELIVERED").length;
  const cancelledCount = orders.filter((o) => o.orderStatus === "CANCELLED").length;

  return (
    <AdminLayout title="Manage Orders">
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-orange-600 font-semibold text-lg animate-pulse">
            Loading orders...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                {orders.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Pending</p>
              <h2 className="text-3xl font-extrabold text-yellow-600 mt-1">
                {pendingCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Delivered</p>
              <h2 className="text-3xl font-extrabold text-green-600 mt-1">
                {deliveredCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Cancelled</p>
              <h2 className="text-3xl font-extrabold text-red-600 mt-1">
                {cancelledCount}
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
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-500">
                  Showing {sortedOrders.length} of {orders.length} orders
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="ALL">All Status</option>
                {orderStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {sortedOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No orders found.
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
                        Customer
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Restaurant
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Date
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Total
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          #{order.id}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          Customer #{order.customerId}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          Restaurant #{order.restaurantId}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {order.orderDate || order.createdAt || "No date"}
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {order.totalPrice} EGP
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

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedOrder && (
            <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-7 relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl"
                >
                  ✕
                </button>

                <div className="mb-6 pr-10">
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Order #{selectedOrder.id}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    View order details and update order status.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="font-bold text-gray-900">
                      {selectedOrder.customerId}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Restaurant ID</p>
                    <p className="font-bold text-gray-900">
                      {selectedOrder.restaurantId}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-bold text-gray-900">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getPaymentStyle(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Current Order Status</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                        selectedOrder.orderStatus
                      )}`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="font-bold text-orange-600">
                      {selectedOrder.totalPrice} EGP
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Items</h3>

                  {selectedOrder.items?.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-orange-50 rounded-xl px-4 py-3 text-sm"
                        >
                          <p>
                            <span className="font-semibold">Menu:</span>{" "}
                            {item.menuItemId}
                          </p>

                          <p>
                            <span className="font-semibold">Qty:</span>{" "}
                            {item.quantity}
                          </p>

                          <p>
                            <span className="font-semibold">Price:</span>{" "}
                            {item.price}
                          </p>

                          <p className="font-bold text-orange-600">
                            {Number(item.price) * Number(item.quantity)} EGP
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-gray-500">
                      No items found for this order.
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Update Status
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="md:col-span-1 w-full rounded-xl border border-orange-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                      disabled={cannotUpdateSelectedOrder}
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleUpdateStatus}
                      disabled={
                        actionLoading ||
                        cannotUpdateSelectedOrder ||
                        newStatus === selectedOrder.orderStatus
                      }
                      className="bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 disabled:bg-orange-300 transition"
                    >
                      {actionLoading ? "Saving..." : "Save Status"}
                    </button>

                    {selectedOrder.orderStatus !== "DELIVERED" &&
                      selectedOrder.orderStatus !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelOrder(selectedOrder.id)}
                          disabled={actionLoading}
                          className="bg-white border border-red-300 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 disabled:opacity-60 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>

                  {cannotUpdateSelectedOrder && (
                    <p className="mt-3 text-sm text-gray-500">
                      This order cannot be updated because it is already{" "}
                      {formatStatusLabel(selectedOrder.orderStatus)}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default AdminOrders;