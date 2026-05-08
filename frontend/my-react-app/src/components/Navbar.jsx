import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    if (role === "ADMIN") return "Admin";
    if (role === "DELIVERY") return "Delivery";
    if (role === "CUSTOMER") return "Customer";
    return "Guest";
  };

  const getProfileIcon = (role) => {
    if (role === "ADMIN") return "🛡️";
    if (role === "DELIVERY") return "🚚";
    if (role === "CUSTOMER") return "👤";
    return "👋";
  };

  const getProfileMainPath = () => {
    if (user?.role === "ADMIN") return "/admin/dashboard";
    if (user?.role === "DELIVERY") return "/delivery/dashboard";
    return "/home";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="text-2xl font-extrabold text-orange-600 hover:text-orange-700 transition"
        >
          Food Ordering
        </button>

        <div className="flex items-center gap-5 relative">
          {user?.role === "CUSTOMER" && (
            <>
              <button
                onClick={() => navigate("/restaurants")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Restaurants
              </button>

              <button
                onClick={() => navigate("/my-orders")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                My Orders
              </button>

              <button
                onClick={() => navigate("/favorites")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Favorites
              </button>
            </>
          )}

          {user?.role === "DELIVERY" && (
            <>
              <button
                onClick={() => navigate("/delivery/dashboard")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/delivery/orders")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                My Deliveries
              </button>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/admin/orders")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Orders
              </button>

              <button
                onClick={() => navigate("/admin/assign-delivery")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Assign Delivery
              </button>

              <button
                onClick={() => navigate("/admin/logs")}
                className="font-semibold text-gray-700 hover:text-orange-600 transition"
              >
                Logs
              </button>
            </>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfile((prev) => !prev)}
                className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl px-4 py-2 hover:bg-orange-100 transition"
                title="Open profile"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  {getProfileIcon(user.role)}
                </div>

                <div className="leading-tight hidden md:block text-left">
                  <p className="font-bold text-gray-900">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-orange-600 font-bold uppercase">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-orange-100 p-5 z-[999]">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-3xl">
                      {getProfileIcon(user.role)}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg">
                        {user.name || "User"}
                      </h3>
                      <p className="text-sm text-orange-600 font-bold">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-500 font-semibold">User ID</p>
                      <p className="text-gray-900 font-bold">
                        #{user.id || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-500 font-semibold">Name</p>
                      <p className="text-gray-900 font-bold">
                        {user.name || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-500 font-semibold">Email</p>
                      <p className="text-gray-900 font-bold break-all">
                        {user.email || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-gray-500 font-semibold">Role</p>
                      <p className="text-gray-900 font-bold">
                        {user.role || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate(getProfileMainPath());
                      }}
                      className="bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                    >
                      Main Page
                    </button>

                    <button
                      onClick={handleLogout}
                      className="bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="bg-orange-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-orange-700 active:scale-95 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;