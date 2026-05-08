import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Favorites() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (itemId) => {
    const updatedFavorites = favorites.filter((item) => item.id !== itemId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const goToRestaurant = (restaurantId) => {
    if (restaurantId) {
      navigate(`/restaurants/${restaurantId}`);
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/restaurants")}
              className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition duration-300"
            >
              Restaurants
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition duration-300"
            >
              Cart
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-orange-600">
            Favorite Meals
          </h1>

          <p className="text-gray-500 mt-2">
            Click any favorite meal to open its restaurant menu.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-500 mb-6">
              You do not have any favorite meals yet.
            </p>

            <button
              onClick={() => navigate("/restaurants")}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((item) => (
              <div
                key={item.id}
                onClick={() => goToRestaurant(item.restaurantId)}
                className="group bg-white/90 backdrop-blur rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer"
              >
                <div className="h-44 bg-red-50 overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition duration-300">
                      ❤️
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition duration-300">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 mt-2 min-h-[48px]">
                    {item.description || "No description available"}
                  </p>

                  <p className="text-orange-600 font-extrabold text-xl mt-4">
                    {item.price} EGP
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    Restaurant ID: {item.restaurantId}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, item.restaurantId);
                      }}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(item.id);
                      }}
                      className="flex-1 bg-white text-red-600 border border-red-300 py-3 rounded-xl font-semibold hover:bg-red-50 hover:shadow-md hover:-translate-y-1 active:scale-95 transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;