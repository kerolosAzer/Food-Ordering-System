import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../api/restaurantApi";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error(
          "Restaurants error:",
          error.response?.data || error.message
        );
        setMessage("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const search = searchTerm.toLowerCase();

    return (
      restaurant.name?.toLowerCase().includes(search) ||
      restaurant.address?.toLowerCase().includes(search) ||
      restaurant.phone?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-orange-600 font-semibold text-lg animate-pulse">
          Loading restaurants...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 hover:-translate-y-0.5 transition duration-300"
          >
            Food Ordering
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/favorites")}
              className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
            >
              Favorites
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition duration-300"
            >
              Cart
            </button>

            <button
              onClick={() => navigate("/home")}
              className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
            >
              Back Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-600">
            Restaurants
          </h1>

          <p className="text-gray-500 mt-2">
            Choose your favorite restaurant and explore its menu.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by restaurant name, address, or phone..."
              className="w-full bg-white/90 backdrop-blur border border-orange-100 rounded-2xl py-4 pl-12 pr-4 shadow-md outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>
        </div>

        {message && (
          <div className="mb-6 text-center text-red-700 bg-red-100 rounded-lg py-3">
            {message}
          </div>
        )}

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? "No restaurants match your search."
                : "No restaurants found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="group bg-white/90 backdrop-blur rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              >
                {/* Restaurant Image */}
                <div className="h-44 bg-orange-100 overflow-hidden flex items-center justify-center">
                  {restaurant.imageUrl ? (
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition duration-300">
                      🍽️
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition duration-300">
                    {restaurant.name}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    📍 {restaurant.address || "No address available"}
                  </p>

                  <p className="text-gray-500 mt-1">
                    📞 {restaurant.phone || "No phone available"}
                  </p>

                  <button
                    onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                    className="mt-6 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;