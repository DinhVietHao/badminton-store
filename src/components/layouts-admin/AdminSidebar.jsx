import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  GridFill,
  BoxSeam,
  PeopleFill,
  Receipt,
  HouseDoorFill,
} from "react-bootstrap-icons";

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
  backgroundColor: isActive ? "#0d6efd" : "transparent",
  display: "block",
  padding: "0.75rem 1.25rem",
  borderRadius: "0.25rem",
  marginBottom: "0.25rem",
  textDecoration: "none",
  transition: "background-color 0.2s, color 0.2s",
});

const navLinkHoverStyle = (e, hover) => {
  if (e.target.style.backgroundColor !== "rgb(13, 110, 253)") {
    e.target.style.backgroundColor = hover
      ? "rgba(255, 255, 255, 0.1)"
      : "transparent";
  }
};

const AdminSidebar = () => {
  return (
    <div className="d-flex flex-column p-3">
      <h4 className="text-center text-warning mb-4">Admin Panel</h4>
      <Nav variant="pills" className="flex-column">
        <NavLink
          to="/admin"
          end
          style={navLinkStyle}
          onMouseEnter={(e) => navLinkHoverStyle(e, true)}
          onMouseLeave={(e) => navLinkHoverStyle(e, false)}
        >
          <GridFill className="me-2" /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          style={navLinkStyle}
          onMouseEnter={(e) => navLinkHoverStyle(e, true)}
          onMouseLeave={(e) => navLinkHoverStyle(e, false)}
        >
          <BoxSeam className="me-2" /> Quản lý Sản phẩm
        </NavLink>

        <NavLink
          to="/admin/users"
          style={navLinkStyle}
          onMouseEnter={(e) => navLinkHoverStyle(e, true)}
          onMouseLeave={(e) => navLinkHoverStyle(e, false)}
        >
          <PeopleFill className="me-2" /> Quản lý Tài khoản
        </NavLink>

        <NavLink
          to="/admin/orders"
          style={navLinkStyle}
          onMouseEnter={(e) => navLinkHoverStyle(e, true)}
          onMouseLeave={(e) => navLinkHoverStyle(e, false)}
        >
          <Receipt className="me-2" /> Quản lý Đơn hàng
        </NavLink>

        <hr className="text-secondary" />

        <NavLink
          to="/"
          style={navLinkStyle}
          onMouseEnter={(e) => navLinkHoverStyle(e, true)}
          onMouseLeave={(e) => navLinkHoverStyle(e, false)}
        >
          <HouseDoorFill className="me-2" /> Về trang Shop
        </NavLink>
      </Nav>
    </div>
  );
};

export default AdminSidebar;
