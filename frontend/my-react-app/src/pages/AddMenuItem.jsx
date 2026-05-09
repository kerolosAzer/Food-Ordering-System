import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAllRestaurants, addMenuItem } from "../api/restaurantApi";

function AddMenuItem() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    restaurantId: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);

        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            restaurantId: data[0].id,
          }));
        }
      } catch (error) {
        console.error(
          "Load restaurants error:",
          error.response?.data || error.message
        );

        setMessageType("error");
        setMessage("Failed to load restaurants");
      } finally {
        setRestaurantsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const selectedRestaurant = restaurants.find(
    (restaurant) => Number(restaurant.id) === Number(formData.restaurantId)
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.restaurantId) {
      setMessageType("error");
      setMessage("Please select a restaurant");
      return;
    }

    try {
      setLoading(true);

      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        restaurant: {
          id: Number(formData.restaurantId),
        },
      };

      const data = await addMenuItem(menuItemData);

      console.log("Menu item added:", data);

      setMessageType("success");
      setMessage(`Menu item added successfully with ID: ${data.id}`);

      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        restaurantId: formData.restaurantId,
      });
    } catch (error) {
      console.error(
        "Add menu item error:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Menu Item">
      <div className="max-w-6xl mx-auto">
        {restaurantsLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-orange-600 font-semibold text-lg animate-pulse">
              Loading restaurants...
            </p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="text-6xl mb-4">🏪</div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              No restaurants found
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              Please add a restaurant first before adding menu items.
            </p>

            <button
              onClick={() => navigate("/admin/add-restaurant")}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
            >
              Add Restaurant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="mb-8">
                <div className="text-5xl mb-4">🍕</div>

                <h1 className="text-3xl font-extrabold text-gray-900">
                  Add New Menu Item
                </h1>

                <p className="text-gray-500 mt-2">
                  Add a food item to a selected restaurant menu.
                </p>
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Restaurant
                  </label>

                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    required
                  >
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name} - ID: {restaurant.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Chicken Burger"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Example: Crispy chicken burger with fries"
                    rows="4"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Menu Item Image URL
                  </label>

                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Paste food image URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Example: 150"
                    min="1"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition duration-300 disabled:bg-orange-300"
                  >
                    {loading ? "Adding Menu Item..." : "Add Menu Item"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/restaurants")}
                    className="flex-1 bg-white text-orange-600 border border-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 hover:shadow-md hover:-translate-y-1 active:scale-95 transition duration-300"
                  >
                    Manage Restaurants
                  </button>
                </div>
              </form>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Item Preview
              </h2>

              <div className="rounded-2xl overflow-hidden bg-orange-50 h-48 flex items-center justify-center mb-5">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Menu item preview"
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-6xl">🍕</span>
                )}
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900">
                {formData.name || "Menu Item Name"}
              </h3>

              <p className="text-gray-500 mt-2 min-h-[50px]">
                {formData.description || "Menu item description"}
              </p>

              <p className="text-orange-600 font-extrabold text-xl mt-4">
                {formData.price ? `${formData.price} EGP` : "0 EGP"}
              </p>

              <div className="mt-5 bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Selected Restaurant</p>
                <p className="font-bold text-gray-900">
                  {selectedRestaurant?.name || "No restaurant selected"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AddMenuItem;