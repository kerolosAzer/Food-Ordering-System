import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderApi";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handlePlaceOrder = async () => {
    setMessage("");

    if (!user?.id) {
      setMessage("Please login first");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    const restaurantId = cartItems[0].restaurantId;

    const orderData = {
      customerId: user.id,
      restaurantId: restaurantId,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      setLoading(true);

      const data = await createOrder(orderData);

      console.log("Order created:", data);

      clearCart();
      setMessage("Order placed successfully");

      setTimeout(() => {
        navigate("/my-orders");
      }, 1000);
    } catch (error) {
      console.error(
        "Create order error:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data?.message || "Failed to place order");
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
          <div className="mb-6 text-center text-sm font-medium text-orange-700 bg-orange-100 rounded-lg py-3">
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

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
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
                      {item.price * item.quantity} EGP
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
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
              </select>

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