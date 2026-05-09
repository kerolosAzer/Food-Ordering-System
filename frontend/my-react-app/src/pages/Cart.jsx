import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/restaurants")}
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 hover:-translate-y-0.5 transition duration-300"
          >
            Food Ordering
          </button>

          <button
            onClick={() => navigate("/restaurants")}
            className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
          >
            Back Restaurants
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-orange-600 text-center mb-10">
          Your Cart
        </h1>

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
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-28 h-24 bg-orange-100 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
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
                      <span className="text-4xl">🍽️</span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {item.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {item.description || "No description available"}
                    </p>

                    <p className="text-orange-600 font-bold mt-2">
                      {item.price} EGP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 active:scale-90 transition"
                  >
                    -
                  </button>

                  <span className="font-bold text-lg">{item.quantity}</span>

                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold hover:bg-orange-200 active:scale-90 transition"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Total</h2>

              <p className="text-2xl font-extrabold text-orange-600">
                {totalPrice} EGP
              </p>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;