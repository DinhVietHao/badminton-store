// src/pages/user/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed }) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ Nếu chưa đăng nhập hoặc không phải admin
    if (!storedUser || !isAllowed) {
        // Lưu cảnh báo để hiển thị sau khi về HomePage
        sessionStorage.setItem(
            "unauthorizedWarning",
            "⚠️ Bạn không có quyền truy cập trang quản trị!"
        );

        // Chuyển hướng về trang chủ
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
