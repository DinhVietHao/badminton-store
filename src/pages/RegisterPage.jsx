// src/pages/RegisterPage.jsx
import React, { useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Alert,
  Container,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    try {
      // Lấy danh sách users từ JSON Server
      const { data: users } = await axios.get("http://localhost:5000/users");

      // Kiểm tra email trùng
      const existingUser = users.find((u) => u.email === form.email);
      if (existingUser) {
        setError("Email đã được sử dụng!");
        setLoading(false);
        return;
      }

      // Lấy id lớn nhất hiện có rồi +1
      const nextId =
        users.length > 0
          ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1
          : 1;

      // Tạo user mới
      const newUser = {
        id: nextId,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        fullName: form.username,
        role: "customer",
        avatarUrl: "",
      };

      // Lưu vào JSON Server
      await axios.post("http://localhost:5000/users", newUser);

      // Thông báo thành công và chuyển hướng
      setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
      setError("Đăng ký thất bại! Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center my-5">
      <Card className="p-4 shadow" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="text-center mb-4">Đăng ký</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Tên người dùng</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Nhập tên người dùng"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                ref={passwordRef}
                required
              />
              <Button
                variant="outline-success"
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
                ref={confirmPasswordRef}
                required
              />
              <Button
                variant="outline-success"
                type="button"
                onClick={() => setShowConfirm((c) => !c)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
            )}
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          <div className="text-center mt-3">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="text-success fw-semibold">
              Đăng nhập
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default RegisterPage;
