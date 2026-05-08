import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/home"
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition duration-300"
          >
            Food Ordering
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/restaurants"
              className="text-gray-700 font-medium hover:text-orange-600 hover:-translate-y-0.5 transition duration-300"
            >
              Restaurants
            </Link>

            <Link
              to="/my-orders"
              className="text-gray-700 font-medium hover:text-orange-600 hover:-translate-y-0.5 transition duration-300"
            >
              My Orders
            </Link>
           <Link
            to="/favorites"
            className="text-gray-700 font-medium hover:text-orange-600 hover:-translate-y-0.5 transition duration-300"
            >
            Favorites
            </Link>
           {user?.role === "ADMIN" && (
                <Link
                    to="/admin"
                    className="text-gray-700 font-medium hover:text-orange-600 hover:-translate-y-0.5 transition duration-300"
                >
                    Admin
                </Link>
                )}

            <button
              onClick={handleLogout}
              className="bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-orange-600 font-semibold mb-3">
            Welcome {user?.name ? user.name : "to our app"} 👋
          </p>

          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Order your favorite food from the best restaurants.
          </h2>

          <p className="text-gray-600 mt-6 text-lg leading-relaxed">
            Browse restaurants, choose your meal, add it to your cart, and place
            your order easily through our food ordering system.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/restaurants"
              className="bg-orange-600 text-white px-7 py-3 rounded-xl font-semibold shadow-md hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              View Restaurants
            </Link>

            <Link
              to="/my-orders"
              className="bg-white text-orange-600 border border-orange-600 px-7 py-3 rounded-xl font-semibold shadow-sm hover:bg-orange-50 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              My Orders
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300">
          <div className="text-8xl mb-6 hover:scale-110 transition duration-300">
            🍔
          </div>

          <h3 className="text-2xl font-bold text-gray-800">
            Fast, Easy, Delicious
          </h3>

          <p className="text-gray-500 mt-3">
            A simple microservices-based food ordering platform.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer">
              <div className="text-3xl">🍕</div>
              <p className="text-sm mt-2 text-gray-600">Pizza</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer">
              <div className="text-3xl">🍗</div>
              <p className="text-sm mt-2 text-gray-600">Chicken</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 hover:-translate-y-1 hover:shadow-md transition duration-300 cursor-pointer">
              <div className="text-3xl">🥤</div>
              <p className="text-sm mt-2 text-gray-600">Drinks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/85 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl mb-4">🏪</div>
            <h4 className="text-xl font-bold text-gray-800">
              Multiple Restaurants
            </h4>
            <p className="text-gray-500 mt-2">
              Browse different restaurants and choose your favorite meals.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl mb-4">🛒</div>
            <h4 className="text-xl font-bold text-gray-800">
              Easy Ordering
            </h4>
            <p className="text-gray-500 mt-2">
              Add items to your cart and place your order in simple steps.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300">
            <div className="text-4xl mb-4">📦</div>
            <h4 className="text-xl font-bold text-gray-800">
              Track Orders
            </h4>
            <p className="text-gray-500 mt-2">
              View your orders and follow their current status easily.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;