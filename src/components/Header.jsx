import React from "react";
import {
  Navbar,
  Nav,
  Container,
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
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Sản phẩm
            </Nav.Link>
          </Nav>

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
      </Container>
    </Navbar>
  );
};

export default Header;
