// src/routes/AdminRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { selectUser } from "../../redux/slices/authSlice";

const AdminRoute = ({ children }) => {
    const user = useSelector(selectUser);

    const isAdmin = user && user.role === "admin";

    if (!isAdmin) {
        Swal.fire({
            icon: "error",
            title: "Truy cập bị từ chối",
            text: "Bạn không có quyền truy cập trang quản trị!",
            confirmButtonText: "Đã hiểu",
        });
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
