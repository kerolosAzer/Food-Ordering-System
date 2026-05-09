import { useNavigate, useLocation } from "react-router-dom";

function AdminLayout({ title, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      label: "Menu",
      path: "/admin/menu",
      icon: "🍽️",
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: "📦",
    },
    {
      label: "Assign Delivery",
      path: "/admin/assign-delivery",
      icon: "🚚",
    },
    {
      label: "System Logs",
      path: "/admin/logs",
      icon: "🧾",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-72 bg-white border-r border-gray-100 shadow-sm min-h-screen fixed left-0 top-0">
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-orange-600">
            Food Ordering
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <div className="px-4 py-5">
          <div className="bg-orange-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-bold text-gray-900 mt-1">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-orange-600 font-semibold mt-1">
              {user?.role || "ADMIN"}
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition text-left ${
                  isActive(item.path)
                    ? "bg-orange-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {title || "Admin Dashboard"}
              </h2>
              <p className="text-gray-500 mt-1">
                Manage system data and monitor operations.
              </p>
            </div>

            <button
              onClick={() => navigate("/home")}
              className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-xl font-semibold hover:bg-orange-50 transition"
            >
              Go Home
            </button>
          </div>
        </header>

        <section className="p-8">{children}</section>
      </main>
    </div>
  );
}

export default AdminLayout;