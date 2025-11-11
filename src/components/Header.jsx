import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  NavDropdown,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  logout,
  selectUser,
  selectIsAuthenticated,
} from "../redux/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", search);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const profileLink =
    user?.role === "admin" ? "/admin" : `/profile/${user?.id}`;
  const profileLabel = user?.role === "admin" ? "Admin Panel" : user?.username;

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        padding: "10px 0",
      }}
    >
      <Container
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              color: "#449D44",
              fontWeight: "bold",
              fontSize: "1.3rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/logo/logo.png"
              alt="logo"
              style={{
                height: "50px",
                marginRight: "10px",
                objectFit: "cover",
              }}
            />
          </Navbar.Brand>

          <Nav className="d-flex align-items-center" style={{ gap: "15px" }}>
            <Nav.Link
              as={Link}
              to="/"
              style={{
                color: "#333",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaHome style={{ marginRight: "6px", color: "#449D44" }} />
              Trang chủ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              style={{
                color: "#333",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaBoxOpen style={{ marginRight: "6px", color: "#449D44" }} />
              Sản phẩm
            </Nav.Link>
          </Nav>
        </div>

        <Form
          onSubmit={handleSearch}
          style={{
            flexGrow: 1,
            maxWidth: "400px",
            margin: "0 40px",
          }}
        >
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "25px 0 0 25px",
                border: "1px solid #449D44",
                boxShadow: "none",
              }}
            />
            <Button
              type="submit"
              style={{
                backgroundColor: "#449D44",
                borderRadius: "0 25px 25px 0",
                border: "1px solid #449D44",
              }}
            >
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Nav.Link
            as={Link}
            to="/cart"
            style={{
              color: "#333",
              display: "flex",
              alignItems: "center",
              fontWeight: "500",
            }}
          >
            <FaShoppingCart style={{ marginRight: "6px", color: "#449D44" }} />
            Giỏ hàng
          </Nav.Link>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#333",
                border: "1px solid #ccc",
                borderRadius: "25px",
                padding: "6px 12px",
                backgroundColor: "#fff",
              }}
            >
              <FaUser style={{ marginRight: "6px", color: "#449D44" }} />
              {isAuthenticated ? profileLabel : "Tài khoản"}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ fontSize: "0.95rem" }}>
              {isAuthenticated ? (
                <>
                  <NavDropdown.Item as={NavLink} to={profileLink}>
                    <FaUser style={{ marginRight: "8px", color: "#449D44" }} />
                    {profileLabel}
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/orders">
                    <FaShoppingCart
                      style={{ marginRight: "6px", color: "#e0f039" }}
                    />
                    Quản lý đơn hàng
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={handleLogout}
                    style={{ color: "red" }}
                  >
                    <FaSignOutAlt
                      style={{ marginRight: "8px", color: "red" }}
                    />
                    Đăng xuất
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">
                    <FaSignInAlt
                      style={{ marginRight: "8px", color: "#449D44" }}
                    />
                    Đăng nhập
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">
                    <FaUserPlus
                      style={{ marginRight: "8px", color: "#449D44" }}
                    />
                    Đăng ký
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
