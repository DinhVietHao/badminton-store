import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/user/HomePage";
import ProductPage from "../pages/user/ProductPage";
import ProductDetailPage from "../pages/user/ProductDetail";
import CartPage from "../pages/user/CartPage";
import OrderPage from "../pages/user/OrderPage";
import OrderDetailPage from "../pages/user/OrderDetailPage";
import AccountPage from "../pages/user/AccountPage";
import EditProfileInfo from "../pages/user/EditProfileInfo";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import ForgotPasswordPage from "../pages/user/ForgotPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
import ChangePassword from "../pages/user/ChangePassword";

import Dashboard from "../pages/admin/Dashboard";
import ProductManager from "../pages/admin/ProductManager";
import ProductDetail from "../pages/admin/ProductDetail";
import UserManager from "../pages/admin/UserManager";
import OrderManager from "../pages/admin/OrderManager";
import AdminRoute from "../pages/user/AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
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
        <Route path="profile/:id/security" element={<ChangePassword />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="users" element={<UserManager />} />
        <Route path="orders" element={<OrderManager />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
