import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  ProgressBar,
} from "react-bootstrap";
import { Eye, EyeSlash, ArrowLeft } from "react-bootstrap-icons";
import zxcvbn from "zxcvbn";
import {
  setLoading,
  setError,
  clearError,
  selectAuthLoading,
  selectAuthError,
} from "../../redux/slices/authSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    dispatch(clearError());
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, password: value });
    setPasswordStrength(zxcvbn(value));
  };

  // Gửi mã OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!form.email) {
      dispatch(setError("Vui lòng nhập email để tiếp tục."));
      return;
    }

    dispatch(setLoading(true));

    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const existingUser = users.find((u) => u.email === form.email);

      if (existingUser) {
        throw new Error("Email đã được sử dụng!");
      }

      // Giả lập gửi OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      console.log("📧 OTP giả lập:", otp);

      setSuccess("Mã OTP đã được gửi (xem console để kiểm tra).");
      setStep(2);
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError(err.message || "Không thể gửi OTP. Vui lòng thử lại."));
    }
  };

  // Xác minh OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (form.otp === generatedOtp) {
      setSuccess("✅ Xác minh thành công! Hãy tạo tài khoản.");
      setStep(3);
    } else {
      dispatch(setError("Mã OTP không chính xác!"));
    }
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      dispatch(setError("Mật khẩu xác nhận không khớp!"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const nextId =
        users.length > 0
          ? Math.max(...users.map((u) => Number(u.id) || 0)) + 1
          : 1;

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

      await axios.post("http://localhost:5000/users", newUser);

      setSuccess("🎉 Đăng ký thành công! Chuyển hướng đến đăng nhập...");
      dispatch(setLoading(false));

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Register error:", err);
      dispatch(setError("Đăng ký thất bại! Vui lòng thử lại."));
    }
  };

  const BackButton = ({ onClick }) => (
    <div className="text-center mt-4">
      <Button
        variant="outline-secondary"
        onClick={onClick}
        className="rounded-pill px-4 d-flex align-items-center mx-auto"
      >
        <ArrowLeft className="me-2" />
        Quay lại
      </Button>
    </div>
  );

  const renderStep = () => {
    if (step === 1) {
      return (
        <Form onSubmit={handleSendOtp}>
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

          <Button
            variant="success"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Đang xử lý...
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        </Form>
      );
    }

    if (step === 2) {
      return (
        <Form onSubmit={handleVerifyOtp}>
          <Form.Group className="mb-3" controlId="otp">
            <Form.Label>Nhập mã OTP</Form.Label>
            <Form.Control
              type="text"
              name="otp"
              placeholder="Nhập mã OTP"
              value={form.otp}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Xác minh OTP
          </Button>

          <BackButton onClick={() => setStep(1)} />
        </Form>
      );
    }

    return (
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
              onChange={handlePasswordChange}
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

          {form.password && (
            <div className="mt-2">
              <ProgressBar
                now={(passwordStrength?.score || 0) * 25}
                variant={
                  ["danger", "warning", "info", "success"][
                    passwordStrength?.score || 0
                  ]
                }
              />
              <small>
                Độ mạnh:{" "}
                {
                  ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"][
                    passwordStrength?.score || 0
                  ]
                }
              </small>
            </div>
          )}
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
            <Spinner as="span" animation="border" size="sm" className="me-2" />
          )}
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>

        <BackButton onClick={() => setStep(2)} />

        <div className="text-center mt-3">
          <span>Đã có tài khoản? </span>
          <Link to="/login" className="text-success fw-semibold">
            Đăng nhập
          </Link>
        </div>
      </Form>
    );
  };

  return (
    <Container className="d-flex justify-content-center my-5">
      <Card className="p-4 shadow" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="text-center mb-4">
          {step === 1
            ? "Xác minh Email"
            : step === 2
            ? "Nhập mã OTP"
            : "Đăng ký tài khoản"}
        </h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {renderStep()}
      </Card>
    </Container>
  );
};

export default RegisterPage;
