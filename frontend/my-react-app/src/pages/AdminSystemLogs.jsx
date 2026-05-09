import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getLatestLogs,
  getLogsByStatus,
  getLogsByActionType,
} from "../api/systemLogApi";

function AdminSystemLogs() {
  const [logs, setLogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setMessage("");

      let data;

      if (statusFilter !== "ALL") {
        data = await getLogsByStatus(statusFilter);
      } else if (actionFilter !== "ALL") {
        data = await getLogsByActionType(actionFilter);
      } else {
        data = await getLatestLogs();
      }

      setLogs(data);
    } catch (error) {
      console.error("Logs error:", error.response?.data || error.message);
      setMessage("Failed to load system logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, actionFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-700 bg-green-100";
      case "ERROR":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const formatDate = (value) => {
    if (!value) return "No date";

    return new Date(value).toLocaleString();
  };

  const successCount = logs.filter((log) => log.status === "SUCCESS").length;
  const errorCount = logs.filter((log) => log.status === "ERROR").length;

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);

    if (value !== "ALL") {
      setActionFilter("ALL");
    }
  };

  const handleActionFilterChange = (value) => {
    setActionFilter(value);

    if (value !== "ALL") {
      setStatusFilter("ALL");
    }
  };

  return (
    <AdminLayout title="System Logs">
      {loading ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <p className="text-orange-600 font-semibold text-lg animate-pulse">
            Loading system logs...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Total Logs</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                {logs.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Success</p>
              <h2 className="text-3xl font-extrabold text-green-600 mt-1">
                {successCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Errors</p>
              <h2 className="text-3xl font-extrabold text-red-600 mt-1">
                {errorCount}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm">Service</p>
              <h2 className="text-xl font-extrabold text-orange-600 mt-2">
                Delivery
              </h2>
            </div>
          </div>

          {message && (
            <div className="mb-6 text-center rounded-xl py-3 font-semibold text-red-700 bg-red-100">
              {message}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  AOP Logs
                </h3>
                <p className="text-sm text-gray-500">
                  Showing latest backend logs captured by AOP.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="SUCCESS">Success</option>
                  <option value="ERROR">Error</option>
                </select>

                <select
                  value={actionFilter}
                  onChange={(e) => handleActionFilterChange(e.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="ALL">All Actions</option>
                  <option value="METHOD_EXECUTION">Method Execution</option>
                </select>

                <button
                  onClick={fetchLogs}
                  className="bg-orange-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                >
                  Refresh
                </button>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No logs found yet. Try using delivery APIs first.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        ID
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Service
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Class
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Method
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Time
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-600">
                        Created At
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-t border-gray-100 hover:bg-orange-50/40 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          #{log.id}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {log.serviceName}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {log.className}
                        </td>

                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          {log.methodName}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                              log.status
                            )}`}
                          >
                            {log.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {log.executionTimeMs} ms
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Log Messages
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={`message-${log.id}`}
                  className={`rounded-xl p-4 text-sm ${
                    log.status === "SUCCESS"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <p className="font-bold">
                    #{log.id} - {log.className}.{log.methodName}()
                  </p>
                  <p className="mt-1">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminSystemLogs;