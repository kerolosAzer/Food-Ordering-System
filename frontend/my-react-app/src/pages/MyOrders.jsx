import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getOrdersByCustomerId, cancelOrder } from "../api/orderApi";
import { getDeliveryByOrderId } from "../api/deliveryApi";
import { useCart } from "../context/CartContext";

function MyOrders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [deliveriesByOrder, setDeliveriesByOrder] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        setMessageType("error");
        setMessage("Please login first");
        setLoading(false);
        return;
      }

      const data = await getOrdersByCustomerId(user.id);
      setOrders(data);

      const deliveryMap = {};

      await Promise.all(
        data.map(async (order) => {
          try {
            const delivery = await getDeliveryByOrderId(order.id);
            deliveryMap[order.id] = delivery;
          } catch (error) {
            deliveryMap[order.id] = null;
          }
        })
      );

      setDeliveriesByOrder(deliveryMap);
    } catch (error) {
      console.error("My orders error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "PREPARING":
        return "bg-purple-100 text-purple-700";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDeliveryStatusStyle = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "PICKED_UP":
        return "bg-purple-100 text-purple-700";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTrackingSteps = (order, delivery) => {
    return [
      {
        label: "Order Placed",
        completed: true,
      },
      {
        label: "Confirmed",
        completed: [
          "CONFIRMED",
          "PREPARING",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ].includes(order.orderStatus),
      },
      {
        label: "Preparing",
        completed: ["PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].includes(
          order.orderStatus
        ),
      },
      {
        label: "Assigned",
        completed: Boolean(delivery),
      },
      {
        label: "Picked Up",
        completed: [
          "PICKED_UP",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ].includes(delivery?.deliveryStatus),
      },
      {
        label: "Out For Delivery",
        completed:
          order.orderStatus === "OUT_FOR_DELIVERY" ||
          order.orderStatus === "DELIVERED" ||
          delivery?.deliveryStatus === "OUT_FOR_DELIVERY" ||
          delivery?.deliveryStatus === "DELIVERED",
      },
      {
        label: "Delivered",
        completed:
          order.orderStatus === "DELIVERED" ||
          delivery?.deliveryStatus === "DELIVERED",
      },
    ];
  };

  const canCancelOrder = (status) => {
    return ["PENDING", "CONFIRMED", "PREPARING"].includes(status);
  };

  const handleToggleDetails = (orderId) => {
    setExpandedOrderId((currentId) => (currentId === orderId ? null : orderId));
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      setCancelLoadingId(orderId);
      setMessage("");

      await cancelOrder(orderId);

      setMessageType("success");
      setMessage("Order cancelled successfully");

      await fetchOrders();
    } catch (error) {
      console.error("Cancel order error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleOrderAgain = (order) => {
    if (!order.items || order.items.length === 0) {
      setMessageType("error");
      setMessage("This order has no items");
      return;
    }

    order.items.forEach((item) => {
      const cartItem = {
        id: item.menuItemId,
        name: `Menu Item #${item.menuItemId}`,
        description: "Added again from previous order",
        price: item.price,
      };

      for (let i = 0; i < item.quantity; i++) {
        addToCart(cartItem, order.restaurantId);
      }
    });

    setMessageType("success");
    setMessage("Order items added to cart");

    setTimeout(() => {
      navigate("/cart");
    }, 700);
  };

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-orange-600 font-semibold text-lg animate-pulse">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-600">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Track, filter, cancel, and reorder your previous orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white/90 rounded-2xl shadow-md p-5 text-center">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-3xl font-extrabold text-orange-600 mt-1">
              {orders.length}
            </h2>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-md p-5 text-center">
            <p className="text-gray-500">Visible Orders</p>
            <h2 className="text-3xl font-extrabold text-orange-600 mt-1">
              {filteredOrders.length}
            </h2>
          </div>

          <div className="bg-white/90 rounded-2xl shadow-md p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-orange-100 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 text-center rounded-lg py-3 font-medium ${
              messageType === "success"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-500 mb-6">
              {orders.length === 0
                ? "You do not have any orders yet."
                : "No orders match this filter."}
            </p>

            <button
              onClick={() => navigate("/restaurants")}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const delivery = deliveriesByOrder[order.id];

              return (
                <div
                  key={order.id}
                  className="bg-white/90 backdrop-blur rounded-3xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Order #{order.id}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Restaurant ID: {order.restaurantId}
                      </p>

                      <p className="text-gray-500 mt-1">
                        Date: {order.orderDate || order.createdAt || "No date"}
                      </p>

                      <p className="text-gray-500 mt-1">
                        Delivery:{" "}
                        {delivery ? (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getDeliveryStatusStyle(
                              delivery.deliveryStatus
                            )}`}
                          >
                            {delivery.deliveryStatus}
                          </span>
                        ) : (
                          <span className="font-semibold text-gray-600">
                            Not assigned yet
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <span
                        className={`inline-block px-4 py-1 rounded-full font-semibold text-sm ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <p className="text-gray-500 mt-2">
                        Payment: {order.paymentMethod} / {order.paymentStatus}
                      </p>

                      <p className="text-2xl font-extrabold text-orange-600 mt-2">
                        {order.totalPrice} EGP
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleToggleDetails(order.id)}
                      className="bg-white text-orange-600 border border-orange-600 px-5 py-2 rounded-xl font-semibold hover:bg-orange-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition duration-300"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>

                    <button
                      onClick={() => handleOrderAgain(order)}
                      className="bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition duration-300"
                    >
                      Order Again
                    </button>

                    {canCancelOrder(order.orderStatus) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelLoadingId === order.id}
                        className="bg-white text-red-600 border border-red-300 px-5 py-2 rounded-xl font-semibold hover:bg-red-50 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition duration-300 disabled:opacity-60"
                      >
                        {cancelLoadingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-6 bg-orange-50 rounded-2xl p-5">
                      <h3 className="font-bold text-gray-800 mb-4 text-lg">
                        Order Tracking
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
                        {getTrackingSteps(order, delivery).map((step) => (
                          <div
                            key={step.label}
                            className={`rounded-xl p-3 text-center text-sm font-bold ${
                              step.completed
                                ? "bg-green-100 text-green-700"
                                : "bg-white text-gray-400"
                            }`}
                          >
                            <div className="text-xl mb-1">
                              {step.completed ? "✓" : "○"}
                            </div>
                            {step.label}
                          </div>
                        ))}
                      </div>

                      <h3 className="font-bold text-gray-800 mb-4 text-lg">
                        Order Details
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">Order ID</p>
                          <p className="font-bold text-gray-800">
                            #{order.id}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">
                            Restaurant ID
                          </p>
                          <p className="font-bold text-gray-800">
                            {order.restaurantId}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">
                            Payment Method
                          </p>
                          <p className="font-bold text-gray-800">
                            {order.paymentMethod}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">
                            Payment Status
                          </p>
                          <p className="font-bold text-gray-800">
                            {order.paymentStatus}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">
                            Delivery User
                          </p>
                          <p className="font-bold text-gray-800">
                            {delivery
                              ? `${delivery.deliveryUserName || "Unknown"} #${
                                  delivery.deliveryUserId
                                }`
                              : "Not assigned yet"}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">
                            Delivery Status
                          </p>
                          {delivery ? (
                            <span
                              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getDeliveryStatusStyle(
                                delivery.deliveryStatus
                              )}`}
                            >
                              {delivery.deliveryStatus}
                            </span>
                          ) : (
                            <p className="font-bold text-gray-800">
                              Not assigned yet
                            </p>
                          )}
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">Assigned At</p>
                          <p className="font-bold text-gray-800">
                            {delivery?.assignedAt || "Not assigned yet"}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-4">
                          <p className="text-gray-500 text-sm">Updated At</p>
                          <p className="font-bold text-gray-800">
                            {delivery?.updatedAt || "Not updated yet"}
                          </p>
                        </div>
                      </div>

                      <h4 className="font-bold text-gray-800 mb-3">Items</h4>

                      <div className="space-y-2">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white rounded-xl px-4 py-3"
                          >
                            <p className="text-gray-700">
                              <span className="font-semibold">Menu ID:</span>{" "}
                              {item.menuItemId}
                            </p>

                            <p className="text-gray-700">
                              <span className="font-semibold">Qty:</span>{" "}
                              {item.quantity}
                            </p>

                            <p className="text-gray-700">
                              <span className="font-semibold">Price:</span>{" "}
                              {item.price} EGP
                            </p>

                            <p className="font-bold text-orange-600">
                              Total: {item.price * item.quantity} EGP
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex justify-end">
                        <div className="bg-white rounded-xl px-6 py-4">
                          <p className="text-gray-500 text-sm">Total Price</p>
                          <p className="text-2xl font-extrabold text-orange-600">
                            {order.totalPrice} EGP
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;