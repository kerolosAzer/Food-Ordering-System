import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import MyOrders from "./pages/MyOrders";

import AdminDashboard from "./pages/AdminDashboard";
import AddRestaurant from "./pages/AddRestaurant";
import AddMenuItem from "./pages/AddMenuItem";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminProfile from "./pages/AdminProfile";
import AdminSystemLogs from "./pages/AdminSystemLogs";
import AdminAssignDelivery from "./pages/AdminAssignDelivery";

import DeliveryOrders from "./pages/DeliveryOrders";
import DeliveryDashboard from "./pages/DeliveryDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected General Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restaurants"
            element={
              <ProtectedRoute>
                <Restaurants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restaurants/:id"
            element={
              <ProtectedRoute>
                <RestaurantDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/add-restaurant"
            element={
              <AdminRoute>
                <AddRestaurant />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/add-menu-item"
            element={
              <AdminRoute>
                <AddMenuItem />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/restaurants"
            element={
              <AdminRoute>
                <AdminRestaurants />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/logs"
            element={
              <AdminRoute>
                <AdminSystemLogs />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/assign-delivery"
            element={
              <AdminRoute>
                <AdminAssignDelivery />
              </AdminRoute>
            }
          />

          {/* Delivery Routes */}
          <Route
            path="/delivery/dashboard"
            element={
              <ProtectedRoute>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery/orders"
            element={
              <ProtectedRoute>
                <DeliveryOrders />
              </ProtectedRoute>
            }
          />

          {/* Unknown Routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;