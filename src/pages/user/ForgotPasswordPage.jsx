import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const foundUser = users.find((u) => u.email === email);

      if (!foundUser) {
        throw new Error("Email chưa được đăng ký!");
      }

      // Tạm thời hiển thị mật khẩu (demo)
      // Sau này có thể gửi email thật
      setMessage(`Mật khẩu của bạn là: ${foundUser.password}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center my-5">
      <Card className="p-4 shadow" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-4">Quên mật khẩu</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Nhập email đã đăng ký</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            {loading ? "Đang xử lý..." : "Lấy lại mật khẩu"}
          </Button>

          <div className="text-center mt-3">
            <Link to="/login">← Quay lại đăng nhập</Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;
