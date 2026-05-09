import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { addRestaurant } from "../api/restaurantApi";

function AddRestaurant() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await addRestaurant(formData);

      console.log("Restaurant added:", data);

      setMessageType("success");
      setMessage(`Restaurant added successfully with ID: ${data.id}`);

      setFormData({
        name: "",
        address: "",
        phone: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error(
        "Add restaurant error:",
        error.response?.data || error.message
      );

      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to add restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Restaurant">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
              <div className="text-5xl mb-4">🏪</div>

              <h1 className="text-3xl font-extrabold text-gray-900">
                Add New Restaurant
              </h1>

              <p className="text-gray-500 mt-2">
                Create a new restaurant with image, address, and contact number.
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
                  Restaurant Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Cairo Restaurant"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Example: Cairo, Egypt"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Example: 01012345678"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Restaurant Image URL
                </label>

                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste restaurant image URL"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition duration-300 disabled:bg-orange-300"
                >
                  {loading ? "Adding Restaurant..." : "Add Restaurant"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/restaurants")}
                  className="flex-1 bg-white text-orange-600 border border-orange-600 py-4 rounded-xl font-bold hover:bg-orange-50 hover:shadow-md hover:-translate-y-1 active:scale-95 transition duration-300"
                >
                  View Restaurants
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Preview
            </h2>

            <div className="rounded-2xl overflow-hidden bg-orange-50 h-48 flex items-center justify-center mb-5">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Restaurant preview"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-6xl">🏪</span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900">
              {formData.name || "Restaurant Name"}
            </h3>

            <p className="text-gray-500 mt-2">
              📍 {formData.address || "Restaurant address"}
            </p>

            <p className="text-gray-500 mt-1">
              📞 {formData.phone || "Restaurant phone"}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddRestaurant;