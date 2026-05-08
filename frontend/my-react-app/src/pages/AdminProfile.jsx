import AdminLayout from "../components/AdminLayout";

function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-100 pb-8">
            <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center text-5xl shadow-sm">
              👤
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {user?.name || "Admin User"}
              </h1>

              <p className="text-gray-500 mt-1">
                {user?.email || "No email available"}
              </p>

              <span className="inline-block mt-4 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold">
                {user?.role || "ADMIN"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">User ID</p>
              <p className="font-bold text-gray-900">
                {user?.id || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-bold text-gray-900">
                {user?.name || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-bold text-gray-900">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-bold text-gray-900">
                {user?.role || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-bold text-gray-900">
                {user?.phone || "Not available"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-bold text-gray-900">
                {user?.address || "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;