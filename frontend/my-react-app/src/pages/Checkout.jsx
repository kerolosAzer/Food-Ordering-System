import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, updatePaymentStatus } from "../api/orderApi";
import { createPayment } from "../api/paymentApi";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // دي للـ Order Service
  // order_service PaymentMethod enum: CASH, CARD
  const getOrderPaymentMethod = () => {
    if (paymentMethod === "VISA") {
      return "CARD";
    }

    return "CASH";
  };

  // دي للـ Payment Service
  // payment_service PaymentMethod enum: CASH_ON_DELIVERY, VISA
  const getPaymentServiceMethod = () => {
    if (paymentMethod === "VISA") {
      return "VISA";
    }

    return "CASH_ON_DELIVERY";
  };

  // دي للـ Order Service
  // order_service PaymentStatus enum: UNPAID, PAID, FAILED
  const getOrderPaymentStatusAfterPayment = () => {
    if (paymentMethod === "VISA") {
      return "PAID";
    }

    return "UNPAID";
  };

  const validateCartRestaurant = () => {
    if (cartItems.length === 0) {
      return true;
    }

    const firstRestaurantId = Number(cartItems[0].restaurantId);

    return cartItems.every(
      (item) => Number(item.restaurantId) === firstRestaurantId
    );
  };

  const handlePlaceOrder = async () => {
    setMessage("");

    if (!user?.id) {
      setMessageType("error");
      setMessage("Please login first");
      return;
    }

    if (cartItems.length === 0) {
      setMessageType("error");
      setMessage("Your cart is empty");
      return;
    }

    if (!validateCartRestaurant()) {
      setMessageType("error");
      setMessage(
        "Your cart contains items from different restaurants. Please clear your cart and order from one restaurant only."
      );
      return;
    }

    const restaurantId = Number(cartItems[0].restaurantId);

    if (!restaurantId) {
      setMessageType("error");
      setMessage("Restaurant ID is missing. Please go back and add items again.");
      return;
    }

    const orderPaymentMethod = getOrderPaymentMethod();
    const paymentServiceMethod = getPaymentServiceMethod();

    const orderData = {
      customerId: Number(user.id),
      customerName: user.name,
      restaurantId: restaurantId,
      paymentMethod: orderPaymentMethod,
      items: cartItems.map((item) => ({
        menuItemId: Number(item.id),
        quantity: Number(item.quantity),
      })),
    };

    try {
      setLoading(true);

      console.log("Order request:", orderData);

      const createdOrder = await createOrder(orderData);

      console.log("Order created:", createdOrder);

      const paymentData = {
        orderId: createdOrder.id,
        paymentMethod: paymentServiceMethod,
        amount: Number(totalPrice),
      };

      console.log("Payment request:", paymentData);

      const createdPayment = await createPayment(paymentData);

      console.log("Payment created:", createdPayment);

      const newOrderPaymentStatus = getOrderPaymentStatusAfterPayment();

      const updatedOrder = await updatePaymentStatus(
        createdOrder.id,
        newOrderPaymentStatus
      );

      console.log("Order payment status updated:", updatedOrder);

      clearCart();

      setMessageType("success");
      setMessage(
        paymentMethod === "VISA"
          ? "Order placed successfully. Visa payment is confirmed."
          : "Order placed successfully. Payment is pending until delivery."
      );

      setTimeout(() => {
        navigate("/my-orders");
      }, 1200);
    } catch (error) {
      console.error("Checkout error:", error.response?.data || error.message);

      setMessageType("error");
      setMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to place order or create payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 hover:-translate-y-0.5 transition duration-300"
          >
            Food Ordering
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
          >
            Back Cart
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-orange-600 text-center mb-10">
          Checkout
        </h1>

        {message && (
          <div
            className={`mb-6 text-center text-sm font-semibold rounded-lg py-3 ${
              messageType === "success"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-500 mb-6">Your cart is empty.</p>

            <button
              onClick={() => navigate("/restaurants")}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Order Summary
              </h2>

              <div className="mb-5 bg-orange-50 text-orange-700 rounded-xl px-4 py-3 text-sm font-semibold">
                Restaurant ID: {cartItems[0].restaurantId}
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.restaurantId}-${item.id}`}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-20 bg-orange-100 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-3xl">🍽️</span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          Unit Price: {item.price} EGP
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-orange-600">
                      {Number(item.price) * Number(item.quantity)} EGP
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Payment
              </h2>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                <option value="VISA">Visa Simulated</option>
              </select>

              <div className="mt-4 bg-orange-50 rounded-2xl p-4 text-sm text-gray-600">
                {paymentMethod === "VISA" ? (
                  <p>
                    Visa payment is simulated only. No real payment gateway will
                    be used. Payment will be marked as confirmed.
                  </p>
                ) : (
                  <p>
                    Cash on Delivery will be marked as pending until the order is
                    delivered.
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-5">
                <span className="text-xl font-bold text-gray-800">Total</span>

                <span className="text-2xl font-extrabold text-orange-600">
                  {totalPrice} EGP
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition duration-300 disabled:bg-orange-300"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;