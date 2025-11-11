// src/routes/AppRoutes.js
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// User Pages
import HomePage from "../pages/user/HomePage";
import ProductPage from "../pages/user/ProductPage";
import ProductDetailPage from "../pages/user/ProductDetail";
import CartPage from "../pages/user/CartPage";
import OrderPage from "../pages/user/OrderPage";
import OrderDetailPage from "../pages/user/OrderDetailPage";
import AccountPage from "../pages/user/AccountPage";
import EditProfileInfo from "../pages/EditProfileInfo";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import ForgotPasswordPage from "../pages/user/ForgotPasswordPage";
import ProtectedRoute from "../pages/user/ProtectedRoute";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import ProductManager from "../pages/admin/ProductManager";
import ProductDetail from "../pages/admin/ProductDetail";
import UserManager from "../pages/admin/UserManager";
import OrderManager from "../pages/admin/OrderManager";

// Common
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  const { isAdmin } = useAuth();

  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="profile/:id" element={<AccountPage />} />
        <Route path="profile/:id/edit" element={<EditProfileInfo />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute isAllowed={isAdmin} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="users" element={<UserManager />} />
          <Route path="orders" element={<OrderManager />} />
        </Route>
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
