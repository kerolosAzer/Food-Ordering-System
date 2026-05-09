import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllUsers, updateUser, deleteUser } from "../api/userApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Admin users error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700";
      case "CUSTOMER":
        return "bg-green-100 text-green-700";
      case "DELIVERY":
        return "bg-blue-100 text-blue-700";
      case "USER":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "CUSTOMER",
    });
  };

  const closeEditUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      phone: "",
      address: "",
      role: "CUSTOMER",
    });
  };

  const handleFormChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      setSaving(true);
      setMessage("");

      const updatedUser = await updateUser(editingUser.id, userForm);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? updatedUser : user
        )
      );

      if (currentUser?.id === editingUser.id) {
        const updatedLocalUser = {
          ...currentUser,
          ...updatedUser,
        };

        localStorage.setItem("user", JSON.stringify(updatedLocalUser));
      }

      setMessageType("success");
      setMessage("User updated successfully");
      closeEditUser();
    } catch (error) {
      console.error("Update user error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (currentUser?.id === userId) {
      setMessageType("error");
      setMessage("You cannot delete your own admin account while logged in");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");

      await deleteUser(userId);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      setMessageType("success");
      setMessage("User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error.response?.data || error.message);
      setMessageType("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to delete user. The user may have related orders."
      );
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search) ||
      user.address?.toLowerCase().includes(search);

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-orange-600 font-semibold text-lg animate-pulse">
            Loading users...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
            {users.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Admins</p>
          <h2 className="text-3xl font-extrabold text-red-600 mt-1">
            {users.filter((user) => user.role === "ADMIN").length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Customers</p>
          <h2 className="text-3xl font-extrabold text-green-600 mt-1">
            {users.filter((user) => user.role === "CUSTOMER").length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Visible Users</p>
          <h2 className="text-3xl font-extrabold text-orange-600 mt-1">
            {filteredUsers.length}
          </h2>
        </div>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">System Users</h3>
            <p className="text-sm text-gray-500">
              Search, edit, and delete registered users.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 min-w-[260px]"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
              <option value="DELIVERY">Delivery</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    ID
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    Address
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    Role
                  </th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      #{user.id}
                    </td>

                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {user.name || "No name"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.phone || "No phone"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {user.address || "No address"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditUser(user)}
                          className="px-4 py-2 rounded-lg border border-orange-200 text-orange-600 font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={currentUser?.id === user.id}
                          className="px-4 py-2 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={closeEditUser}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Edit User
            </h2>

            <p className="text-gray-500 mb-6">
              Update user information and role.
            </p>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  placeholder="User name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
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
                  value={userForm.phone}
                  onChange={handleFormChange}
                  placeholder="Phone"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={userForm.address}
                  onChange={handleFormChange}
                  placeholder="Address"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>

                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  disabled={currentUser?.id === editingUser.id}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="USER">User</option>
                  <option value="DELIVERY">Delivery</option>
                  <option value="ADMIN">Admin</option>
                </select>

                {currentUser?.id === editingUser.id && (
                  <p className="text-xs text-gray-500 mt-2">
                    You cannot change your own admin role while logged in.
                  </p>
                )}
              </div>

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
                  onClick={closeEditUser}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;