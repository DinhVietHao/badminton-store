import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import {
  updateUser,
  setLoading,
  setError,
  clearError,
  selectUser,
  selectAuthLoading,
  selectAuthError,
} from "../../redux/slices/authSlice";

const EditProfileInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "",
    birthday: user?.birthday || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwMessage, setPwMessage] = useState(null);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (!user || String(user.id) !== id) {
    navigate(`/profile/${user?.id}`);
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    dispatch(setLoading(true));
    setMessage(null);

    try {
      const updatedUserData = {
        ...user,
        ...formData,
        fullName: formData.fullname,
      };

      const response = await axios.put(
        `http://localhost:5000/users/${user.id}`,
        updatedUserData
      );

      localStorage.setItem("user", JSON.stringify(response.data));

      dispatch(updateUser(response.data));

      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      setTimeout(() => navigate(`/profile/${id}`), 1000);

      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setError("Có lỗi xảy ra, vui lòng thử lại!"));
    }
  };

  const handlePasswordSave = async () => {
    setPwLoading(true);
    setPwMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwMessage({ type: "danger", text: "Mật khẩu xác nhận không khớp!" });
      setPwLoading(false);
      return;
    }

    try {
      if (user.password !== passwordData.currentPassword) {
        throw new Error("Mật khẩu hiện tại không đúng.");
      }

      const updatedUserData = { ...user, password: passwordData.newPassword };

      const response = await axios.put(
        `http://localhost:5000/users/${user.id}`,
        updatedUserData
      );

      localStorage.setItem("user", JSON.stringify(response.data));

      dispatch(updateUser(response.data));

      setPwMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPwMessage({
        type: "danger",
        text:
          err.message ||
          "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại!",
      });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <Card className="p-4 shadow-sm">
        <Button
          variant="secondary"
          className="mb-3 px-4 fw-bold"
          style={{
            width: "fit-content",
            alignSelf: "flex-start",
            backgroundColor: "#449D44",
            border: "none",
          }}
          onClick={() => navigate(`/profile/${id}`)}
        >
          ← Quay lại
        </Button>

        <h4 className="fw-bold text-uppercase mb-4">Chỉnh sửa hồ sơ</h4>

        {message && <Alert variant={message.type}>{message.text}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <h5 className="fw-bold mb-3 text-success">Thông tin cá nhân</h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên *</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại *</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </Form.Group>

          <div className="text-center mb-5">
            <Button
              variant="success"
              style={{
                minWidth: "180px",
                backgroundColor: "#449D44",
                border: "none",
              }}
              onClick={handleSave}
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
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditProfileInfo;
