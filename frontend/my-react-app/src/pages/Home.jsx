import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const getMainButton = () => {
    if (user?.role === "ADMIN") {
      return {
        label: "Go to Admin Dashboard",
        path: "/admin/dashboard",
      };
    }

    if (user?.role === "DELIVERY") {
      return {
        label: "Go to Delivery Dashboard",
        path: "/delivery/dashboard",
      };
    }

    return {
      label: "View Restaurants",
      path: "/restaurants",
    };
  };

  const mainButton = getMainButton();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-orange-600 font-bold mb-5">
              Welcome {user?.name || "Guest"} 👋
            </p>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Order your favorite food from the best restaurants.
            </h1>

            <p className="text-gray-600 text-lg mt-7 leading-relaxed max-w-2xl">
              Browse restaurants, choose your meal, add it to your cart, and
              place your order easily through our food ordering system.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button
                onClick={() => navigate(mainButton.path)}
                className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition duration-300"
              >
                {mainButton.label}
              </button>

              {user?.role === "CUSTOMER" && (
                <button
                  onClick={() => navigate("/my-orders")}
                  className="bg-white text-orange-600 border border-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                >
                  My Orders
                </button>
              )}

              {user?.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin/logs")}
                  className="bg-white text-orange-600 border border-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                >
                  System Logs
                </button>
              )}

              {user?.role === "DELIVERY" && (
                <button
                  onClick={() => navigate("/delivery/orders")}
                  className="bg-white text-orange-600 border border-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                >
                  My Deliveries
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="text-8xl mb-6">🍔</div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Fast, Easy, Delicious
            </h2>

            <p className="text-gray-500 mt-4">
              A simple microservices-based food ordering platform.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="bg-orange-50 rounded-2xl p-5">
                <div className="text-3xl">🍕</div>
                <p className="text-gray-600 text-sm mt-2">Pizza</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5">
                <div className="text-3xl">🍗</div>
                <p className="text-gray-600 text-sm mt-2">Chicken</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-5">
                <div className="text-3xl">🥤</div>
                <p className="text-gray-600 text-sm mt-2">Drinks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Multiple Restaurants
            </h3>
            <p className="text-gray-500 mt-3">
              Browse different restaurants and their menus.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Easy Ordering
            </h3>
            <p className="text-gray-500 mt-3">
              Add items to cart and checkout smoothly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Track Orders
            </h3>
            <p className="text-gray-500 mt-3">
              Follow your order status until delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;