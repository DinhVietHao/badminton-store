import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Container,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import {
  setLoading,
  setUser,
  setError,
  clearError,
  selectAuth,
} from "../../redux/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(selectAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Remember me
  useEffect(() => {
    const saved = localStorage.getItem("rememberedUser");
    if (saved) {
      const { email, password, expires } = JSON.parse(saved);
      if (!expires || Date.now() < expires) {
        setFormData({ email, password });
        setRemember(true);
      } else {
        localStorage.removeItem("rememberedUser");
      }
    }
  }, []);

  // Điều hướng sau khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(`/profile/${user.id}`);
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Xóa lỗi khi unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Xử lý thay đổi form đăng nhập
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const foundUser = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!foundUser) {
        throw new Error("Sai email hoặc mật khẩu!");
      }

      localStorage.setItem("user", JSON.stringify(foundUser));
      dispatch(setUser(foundUser));

      if (remember) {
        const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ ...formData, expires })
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }
    } catch (err) {
      dispatch(setError(err.message || "Đăng nhập thất bại!"));
    }
  };

  return (
    <Container className="d-flex justify-content-center my-5">
      <Card className="p-4 shadow" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4">Đăng nhập</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash /> : <Eye />}
              </Button>
            </InputGroup>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <Form.Check
                type="checkbox"
                label="Nhớ mật khẩu"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="m-0"
              />
              <Link to="/forgot-password" className="text-decoration-none">
                Quên mật khẩu?
              </Link>
            </div>
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100 d-flex justify-content-center align-items-center"
            disabled={loading}
            style={{ backgroundColor: "#449D44", borderColor: "#449D44" }}
          >
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                className="me-2"
              />
            )}
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="text-center mt-3">
            <span>Chưa có tài khoản? </span>
            <Link to="/register">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginPage;
