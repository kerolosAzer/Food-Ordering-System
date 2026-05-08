import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  getAllRestaurants,
  getMenuByRestaurantId,
  deleteRestaurant,
  deleteMenuItem,
  updateRestaurant,
  updateMenuItem,
} from "../api/restaurantApi";

function AdminRestaurants() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    address: "",
    phone: "",
    imageUrl: "",
  });

  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error(
          "Admin restaurants error:",
          error.response?.data || error.message
        );
        setMessageType("error");
        setMessage("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleViewMenu = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuItems([]);
    setMessage("");

    try {
      setMenuLoading(true);
      const data = await getMenuByRestaurantId(restaurant.id);
      setMenuItems(data);
    } catch (error) {
      console.error("Admin menu error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage("Failed to load menu items");
    } finally {
      setMenuLoading(false);
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      await deleteRestaurant(restaurantId);

      const updatedRestaurants = restaurants.filter(
        (restaurant) => restaurant.id !== restaurantId
      );

      setRestaurants(updatedRestaurants);

      if (selectedRestaurant?.id === restaurantId) {
        setSelectedRestaurant(null);
        setMenuItems([]);
      }

      setMessageType("success");
      setMessage("Restaurant deleted successfully");
    } catch (error) {
      console.error(
        "Delete restaurant error:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to delete restaurant. Delete its menu items or related data first."
      );
    }
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      await deleteMenuItem(menuItemId);

      const updatedMenuItems = menuItems.filter(
        (item) => item.id !== menuItemId
      );

      setMenuItems(updatedMenuItems);

      setMessageType("success");
      setMessage("Menu item deleted successfully");
    } catch (error) {
      console.error(
        "Delete menu item error:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to delete menu item");
    }
  };

  const openEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
    setRestaurantForm({
      name: restaurant.name || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      imageUrl: restaurant.imageUrl || "",
    });
  };

  const closeEditRestaurant = () => {
    setEditingRestaurant(null);
    setRestaurantForm({
      name: "",
      address: "",
      phone: "",
      imageUrl: "",
    });
  };

  const handleRestaurantFormChange = (e) => {
    setRestaurantForm({
      ...restaurantForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();

    if (!editingRestaurant) return;

    try {
      setSaving(true);
      setMessage("");

      const updatedRestaurant = await updateRestaurant(
        editingRestaurant.id,
        restaurantForm
      );

      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((restaurant) =>
          restaurant.id === editingRestaurant.id ? updatedRestaurant : restaurant
        )
      );

      if (selectedRestaurant?.id === editingRestaurant.id) {
        setSelectedRestaurant(updatedRestaurant);
      }

      setMessageType("success");
      setMessage("Restaurant updated successfully");
      closeEditRestaurant();
    } catch (error) {
      console.error(
        "Update restaurant error:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to update restaurant");
    } finally {
      setSaving(false);
    }
  };

  const openEditMenuItem = (item) => {
    setEditingMenuItem(item);
    setMenuItemForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      imageUrl: item.imageUrl || "",
    });
  };

  const closeEditMenuItem = () => {
    setEditingMenuItem(null);
    setMenuItemForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
    });
  };

  const handleMenuItemFormChange = (e) => {
    setMenuItemForm({
      ...menuItemForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();

    if (!editingMenuItem || !selectedRestaurant) return;

    try {
      setSaving(true);
      setMessage("");

      const menuItemData = {
        name: menuItemForm.name,
        description: menuItemForm.description,
        price: Number(menuItemForm.price),
        imageUrl: menuItemForm.imageUrl,
        restaurant: {
          id: selectedRestaurant.id,
        },
      };

      const updatedItem = await updateMenuItem(editingMenuItem.id, menuItemData);

      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingMenuItem.id ? updatedItem : item
        )
      );

      setMessageType("success");
      setMessage("Menu item updated successfully");
      closeEditMenuItem();
    } catch (error) {
      console.error(
        "Update menu item error:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to update menu item");
    } finally {
      setSaving(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const search = searchTerm.toLowerCase();

    return (
      restaurant.name?.toLowerCase().includes(search) ||
      restaurant.address?.toLowerCase().includes(search) ||
      restaurant.phone?.toLowerCase().includes(search)
    );
  });

  return (
    <AdminLayout title="Restaurants">
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-orange-600 font-semibold text-lg animate-pulse">
            Loading restaurants...
          </p>
        </div>
      ) : (
        <>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Total Restaurants</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                {restaurants.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Visible Restaurants</p>
              <h2 className="text-3xl font-extrabold text-orange-600 mt-1">
                {filteredRestaurants.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Selected Menu Items</p>
              <h2 className="text-3xl font-extrabold text-green-600 mt-1">
                {menuItems.length}
              </h2>
            </div>

            <button
              onClick={() => navigate("/admin/add-restaurant")}
              className="bg-orange-600 text-white rounded-2xl p-5 shadow-sm hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 transition duration-300 text-left"
            >
              <p className="text-orange-100 text-sm">Quick Action</p>
              <h2 className="text-2xl font-extrabold mt-1">
                + Add Restaurant
              </h2>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Restaurants
                </h2>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search restaurants..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No restaurants found.
                </div>
              ) : (
                <div className="p-4 space-y-3 max-h-[650px] overflow-y-auto">
                  {filteredRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className={`w-full rounded-2xl p-4 border hover:shadow-md hover:-translate-y-1 transition duration-300 ${
                        selectedRestaurant?.id === restaurant.id
                          ? "bg-orange-50 border-orange-300"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <button
                        onClick={() => handleViewMenu(restaurant)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-14 bg-orange-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                            {restaurant.imageUrl ? (
                              <img
                                src={restaurant.imageUrl}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">🏪</span>
                            )}
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-800">
                              {restaurant.name}
                            </h3>

                            <p className="text-xs text-gray-500">
                              ID: {restaurant.id}
                            </p>

                            <p className="text-xs text-gray-500">
                              {restaurant.address || "No address"}
                            </p>
                          </div>
                        </div>
                      </button>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openEditRestaurant(restaurant)}
                          className="w-full bg-orange-50 text-orange-600 border border-orange-200 py-2 rounded-xl font-semibold hover:bg-orange-100 hover:shadow-md active:scale-95 transition duration-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteRestaurant(restaurant.id)}
                          className="w-full bg-white text-red-600 border border-red-300 py-2 rounded-xl font-semibold hover:bg-red-50 hover:shadow-md active:scale-95 transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              {!selectedRestaurant ? (
                <div className="h-full min-h-[400px] flex items-center justify-center text-center">
                  <div>
                    <div className="text-6xl mb-4">🍽️</div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Select a restaurant
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Choose a restaurant from the left to view its menu.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-16 rounded-2xl bg-orange-100 overflow-hidden flex items-center justify-center">
                        {selectedRestaurant.imageUrl ? (
                          <img
                            src={selectedRestaurant.imageUrl}
                            alt={selectedRestaurant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">🏪</span>
                        )}
                      </div>

                      <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                          {selectedRestaurant.name}
                        </h2>

                        <p className="text-gray-500 mt-1">
                          Restaurant ID: {selectedRestaurant.id}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/admin/add-menu-item")}
                      className="bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                    >
                      Add New Item
                    </button>
                  </div>

                  {menuLoading ? (
                    <p className="text-orange-600 font-semibold animate-pulse">
                      Loading menu...
                    </p>
                  ) : menuItems.length === 0 ? (
                    <div className="bg-orange-50 rounded-2xl p-8 text-center">
                      <p className="text-gray-500 mb-5">
                        This restaurant has no menu items yet.
                      </p>

                      <button
                        onClick={() => navigate("/admin/add-menu-item")}
                        className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition duration-300"
                      >
                        Add Menu Item
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-2xl p-4 hover:shadow-md hover:-translate-y-1 transition duration-300"
                        >
                          <div className="h-36 bg-white rounded-xl overflow-hidden flex items-center justify-center mb-4">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-110 transition duration-300"
                              />
                            ) : (
                              <span className="text-5xl">🍔</span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-gray-900">
                            {item.name}
                          </h3>

                          <p className="text-gray-500 mt-1 min-h-[48px]">
                            {item.description || "No description available"}
                          </p>

                          <p className="text-orange-600 font-extrabold text-lg mt-3">
                            {item.price} EGP
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Menu Item ID: {item.id}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button
                              onClick={() => openEditMenuItem(item)}
                              className="w-full bg-orange-50 text-orange-600 border border-orange-200 py-2 rounded-xl font-semibold hover:bg-orange-100 hover:shadow-md active:scale-95 transition duration-300"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="w-full bg-white text-red-600 border border-red-300 py-2 rounded-xl font-semibold hover:bg-red-50 hover:shadow-md active:scale-95 transition duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {editingRestaurant && (
            <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative">
                <button
                  onClick={closeEditRestaurant}
                  className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Edit Restaurant
                </h2>

                <p className="text-gray-500 mb-6">
                  Update restaurant information.
                </p>

                <form onSubmit={handleSaveRestaurant} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={restaurantForm.name}
                    onChange={handleRestaurantFormChange}
                    placeholder="Restaurant name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />

                  <input
                    type="text"
                    name="address"
                    value={restaurantForm.address}
                    onChange={handleRestaurantFormChange}
                    placeholder="Address"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    value={restaurantForm.phone}
                    onChange={handleRestaurantFormChange}
                    placeholder="Phone"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />

                  <input
                    type="text"
                    name="imageUrl"
                    value={restaurantForm.imageUrl}
                    onChange={handleRestaurantFormChange}
                    placeholder="Image URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  />

                  {restaurantForm.imageUrl && (
                    <div className="h-40 rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center">
                      <img
                        src={restaurantForm.imageUrl}
                        alt="Restaurant preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 disabled:bg-orange-300 transition"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={closeEditRestaurant}
                      className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editingMenuItem && (
            <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative">
                <button
                  onClick={closeEditMenuItem}
                  className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Edit Menu Item
                </h2>

                <p className="text-gray-500 mb-6">
                  Update menu item information.
                </p>

                <form onSubmit={handleSaveMenuItem} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={menuItemForm.name}
                    onChange={handleMenuItemFormChange}
                    placeholder="Item name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />

                  <textarea
                    name="description"
                    value={menuItemForm.description}
                    onChange={handleMenuItemFormChange}
                    placeholder="Description"
                    rows="3"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    required
                  />

                  <input
                    type="number"
                    name="price"
                    value={menuItemForm.price}
                    onChange={handleMenuItemFormChange}
                    placeholder="Price"
                    min="1"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />

                  <input
                    type="text"
                    name="imageUrl"
                    value={menuItemForm.imageUrl}
                    onChange={handleMenuItemFormChange}
                    placeholder="Image URL"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  />

                  {menuItemForm.imageUrl && (
                    <div className="h-40 rounded-2xl overflow-hidden bg-orange-50 flex items-center justify-center">
                      <img
                        src={menuItemForm.imageUrl}
                        alt="Menu item preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 disabled:bg-orange-300 transition"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={closeEditMenuItem}
                      className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default AdminRestaurants;