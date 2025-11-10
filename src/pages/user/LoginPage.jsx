import React, { useState, useEffect } from "react";
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
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("rememberedUser");
    if (saved) {
      const { email, password, expires } = JSON.parse(saved);
      if (!expires || Date.now() < expires) {
        setEmail(email);
        setPassword(password);
        setRemember(true);
      } else {
        localStorage.removeItem("rememberedUser"); // Xóa khi hết hạn
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user && user.id) {
        // (hết hạn sau 7 ngày)
        if (remember) {
          const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({ email, password, expires })
          );
        } else {
          localStorage.removeItem("rememberedUser");
        }

        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate(`/profile/${user.id}`);
          }
        }, 800);
      } else {
        throw new Error("Không tìm thấy người dùng!");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại!");
      setLoading(false);
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
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
