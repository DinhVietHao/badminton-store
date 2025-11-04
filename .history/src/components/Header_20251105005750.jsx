import React, { useState } from "react";
import React from "react";
import {
  Navbar,
  Nav,
  Container,
<<<<<<< HEAD
  Dropdown,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
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

const Header = () => {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userName = "Lượng";

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", search);
  };

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
        {/* Logo + menu trái */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
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
=======
  Form,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";
import { BoxArrowInRight, PersonPlus } from "react-bootstrap-icons";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/"; // Redirect về home
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Badminton Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
>>>>>>> 2f6f6aedb953d9c458327db1c47ba51f601fa576
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
<<<<<<< HEAD
        </div>

        {/* Ô tìm kiếm */}
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

        {/* Giỏ hàng + tài khoản */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
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
              {isLoggedIn ? userName : "Tài khoản"}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ fontSize: "0.95rem" }}>
              {isLoggedIn ? (
                <>
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUser style={{ marginRight: "8px", color: "#449D44" }} />
                    Tài khoản của tôi
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setIsLoggedIn(false)}
                    style={{ color: "red" }}
                  >
                    <FaSignOutAlt
                      style={{ marginRight: "8px", color: "red" }}
                    />
                    Đăng xuất
                  </Dropdown.Item>
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
=======

          <Nav>
            <Nav.Link as={Link} to="/cart">
              Giỏ hàng
            </Nav.Link>

            <NavDropdown
              title={user ? user.username : "Tài khoản"}
              id="account-dropdown"
              align="end"
              renderMenuOnMount={true}
            >
              {user ? (
                <>
                  <NavDropdown.Item as={NavLink} to={`/profile/${user.id}`}>
                    Trang cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={NavLink} to="/login">
                    <BoxArrowInRight className="me-2" />
                    Đăng nhập
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/register">
                    <PersonPlus className="me-2" />
                    Đăng ký
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
>>>>>>> 2f6f6aedb953d9c458327db1c47ba51f601fa576
      </Container>
    </Navbar>
  );
};

export default Header;
