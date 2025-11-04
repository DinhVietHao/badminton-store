import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/user/HomePage";
import ProductPage from "../pages/user/ProductPage";
import CartPage from "../pages/user/CartPage";
import OrderPage from "../pages/user/OrderPage";
import AccountPage from "../pages/user/AccountPage";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductDetailPage from "../pages/user/ProductDetail";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ProductManager from "../pages/admin/ProductManager";
import UserManager from "../pages/admin/UserManager";
import OrderManager from "../pages/admin/OrderManager";
import OrderDetailPage from "../pages/user/OrderDetailPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="product/:id" element={<Pro />} />
        <Route path="users" element={<UserManager />} />
        <Route path="orders" element={<OrderManager />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
