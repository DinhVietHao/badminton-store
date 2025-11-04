import { Route, Routes } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";
import AccountPage from "../pages/AccountPage";
import AdminPage from "../pages/AdminPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
<<<<<<< HEAD
import EditProfileInfo from "../pages/EditProfileInfo";
=======
import OrderDetailPage from "../pages/OrderDetailPage";
>>>>>>> c20e7500ab8f916633a955ae3dfa8da6b044773c
import ProductDetailPage from "../pages/ProductDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderPage />} />
<<<<<<< HEAD
        {/* 👇 thêm :id */}
        <Route path="profile/:id" element={<AccountPage />} />
=======
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="account" element={<AccountPage />} />
>>>>>>> c20e7500ab8f916633a955ae3dfa8da6b044773c
        <Route path="admin" element={<AdminPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/profile/:id/edit" element={<EditProfileInfo />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
