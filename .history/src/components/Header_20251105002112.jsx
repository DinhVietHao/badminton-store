import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
  FaPhoneAlt,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

const Header = () => {
  // Giả lập trạng thái đăng nhập (bạn thay bằng context thực tế)
  const isLoggedIn = false;
  const userName = "Lượng";

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        padding: "10px 0",
      }}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center fw-bold text-dark"
          style={{ textDecoration: "none" }}
        >
          <Image
            src="/images/logo/logo.png"
            alt="Badminton Shop Logo"
            height="60"
            className="me-2"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          {/* Menu trái */}
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="d-flex align-items-center"
              style={{
                color: "#000",
                fontWeight: "500",
                marginRight: "15px",
              }}
            >
              <FaHome
                className="me-2"
                style={{ color: "#449D44", fontSize: "16px" }}
              />{" "}
              Trang chủ
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/products"
              className="d-flex align-items-center"
              style={{
                color: "#000",
                fontWeight: "500",
                marginRight: "15px",
              }}
            >
              <FaBoxOpen
                className="me-2"
                style={{ color: "#449D44", fontSize: "16px" }}
              />{" "}
              Sản phẩm
            </Nav.Link>
          </Nav>

          {/* Menu phải */}
          <Nav className="align-items-center">
            {/* Hotline */}
            <div
              className="me-4 d-flex align-items-center"
              style={{
                color: "#000",
                fontWeight: "500",
                fontSize: "15px",
              }}
            >
              <FaPhoneAlt
                className="me-2"
                style={{ color: "#449D44", fontSize: "16px" }}
              />
              <span>Hotline: 0919 301 337</span>
            </div>

            {/* Giỏ hàng */}
            <Nav.Link
              as={Link}
              to="/cart"
              className="d-flex align-items-center me-3"
              style={{
                color: "#000",
                fontWeight: "500",
              }}
            >
              <FaShoppingCart
                className="me-2"
                style={{ color: "#449D44", fontSize: "16px" }}
              />{" "}
              Giỏ hàng
            </Nav.Link>

            {/* Tài khoản dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-account"
                className="d-flex align-items-center fw-medium"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#000",
                  fontWeight: "500",
                  boxShadow: "none",
                }}
              >
                <FaUser
                  className="me-2"
                  style={{ color: "#449D44", fontSize: "16px" }}
                />
                {isLoggedIn ? userName : "Tài khoản"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  padding: "8px 0",
                }}
              >
                {!isLoggedIn ? (
                  <>
                    <Dropdown.Item
                      as={Link}
                      to="/login"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#000",
                        fontWeight: "500",
                      }}
                    >
                      <FaSignInAlt
                        className="me-2"
                        style={{ color: "#449D44" }}
                      />
                      Đăng nhập
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/register"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#000",
                        fontWeight: "500",
                      }}
                    >
                      <FaUserPlus
                        className="me-2"
                        style={{ color: "#449D44" }}
                      />
                      Đăng ký
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#000",
                        fontWeight: "500",
                      }}
                    >
                      <FaUser className="me-2" style={{ color: "#449D44" }} />
                      Tài khoản
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#d9534f",
                        fontWeight: "500",
                      }}
                    >
                      <FaSignOutAlt className="me-2" /> Đăng xuất
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
