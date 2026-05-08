import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-300 ${
      isActive
        ? "bg-orange-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-950 text-white z-50 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-xl shrink-0">
              🍔
            </div>

            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg leading-tight">
                  Food Ordering
                </h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pt-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full bg-slate-800 text-gray-200 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition duration-300"
          >
            {sidebarOpen ? "⬅ Collapse" : "➡"}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/admin" end className={linkClass}>
            <span className="text-lg">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <span className="text-lg">👥</span>
            {sidebarOpen && <span>Users</span>}
          </NavLink>

          <NavLink to="/admin/restaurants" className={linkClass}>
            <span className="text-lg">🏪</span>
            {sidebarOpen && <span>Restaurants</span>}
          </NavLink>

          <NavLink to="/admin/add-restaurant" className={linkClass}>
            <span className="text-lg">➕</span>
            {sidebarOpen && <span>Add Restaurant</span>}
          </NavLink>

          <NavLink to="/admin/add-menu-item" className={linkClass}>
            <span className="text-lg">🍕</span>
            {sidebarOpen && <span>Add Menu Item</span>}
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <span className="text-lg">📦</span>
            {sidebarOpen && <span>Orders</span>}
          </NavLink>

          <NavLink to="/home" className={linkClass}>
            <span className="text-lg">🏠</span>
            {sidebarOpen && <span>Website</span>}
          </NavLink>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 text-gray-200 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition duration-300"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">
              Manage your food ordering system
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/profile")}
            className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-orange-50 hover:-translate-y-0.5 transition duration-300"
            title="View admin profile"
          >
            <div className="text-right">
              <p className="font-bold text-gray-800">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || "ADMIN"}
              </p>
            </div>

            <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm hover:shadow-md transition">
              👤
            </div>
          </button>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;