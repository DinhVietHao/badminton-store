import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Badminton Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" exact>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Sản phẩm
            </Nav.Link>
          </Nav>
          <Form className="d-flex mx-auto">
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav>
            <Nav.Link as={Link} to="/cart">
              Giỏ hàng
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Tài khoản
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
