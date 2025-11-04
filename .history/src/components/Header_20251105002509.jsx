import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import {
  FaSearch,
  FaPhoneAlt,
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";

const Header = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      console.log("Tìm kiếm:", search);
    }
  };

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        padding: "10px 0",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          style={{ color: "#449D44", fontWeight: "bold", fontSize: "1.3rem" }}
        >
          <img
            src="/images/logo/logo.png"
            alt="logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          Badminton Shop
        </Navbar.Brand>

        {/* Hotline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#449D44",
            fontWeight: "500",
            marginLeft: "20px",
            marginRight: "30px",
            fontSize: "0.95rem",
          }}
        >
          <FaPhoneAlt style={{ marginRight: "6px" }} /> Hotline: 0919 301 337
        </div>

        {/* Thanh tìm kiếm */}
        <Form
          onSubmit={handleSearch}
          className="mx-auto"
          style={{ flexGrow: 1, maxWidth: "400px" }}
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

        {/* Menu */}
        <Nav
          className="ms-auto d-flex align-items-center"
          style={{ gap: "15px" }}
        >
          <Nav.Link as={Link} to="/" style={{ color: "#333" }}>
            <FaHome style={{ marginRight: "5px", color: "#449D44" }} />
            Trang chủ
          </Nav.Link>
          <Nav.Link as={Link} to="/products" style={{ color: "#333" }}>
            <FaBoxOpen style={{ marginRight: "5px", color: "#449D44" }} />
            Sản phẩm
          </Nav.Link>
          <Nav.Link as={Link} to="/cart" style={{ color: "#333" }}>
            <FaShoppingCart style={{ marginRight: "5px", color: "#449D44" }} />
            Giỏ hàng
          </Nav.Link>
          <Nav.Link as={Link} to="/login" style={{ color: "#333" }}>
            <FaUser style={{ marginRight: "5px", color: "#449D44" }} />
            Tài khoản
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
