import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
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

const EditProfileInfo = () => {
  const { user, updateUser, updatePassword } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
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

  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pwMessage, setPwMessage] = useState(null);

  // Ngăn người khác truy cập sai id
  if (!user || String(user.id) !== id) {
    navigate(`/profile/${user?.id}`);
    return null;
  }

  // Cập nhật input thông tin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cập nhật input mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu thay đổi thông tin cá nhân
  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const updatedUser = { ...user, ...formData };
      await updateUser(updatedUser);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      setTimeout(() => navigate(`/profile/${id}`), 1000);
    } catch {
      setMessage({ type: "danger", text: "Có lỗi xảy ra, vui lòng thử lại!" });
    } finally {
      setLoading(false);
    }
  };

  // Đổi mật khẩu
  const handlePasswordSave = async () => {
    setPwLoading(true);
    setPwMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwMessage({ type: "danger", text: "Mật khẩu xác nhận không khớp!" });
      setPwLoading(false);
      return;
    }

    try {
      await updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPwMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPwMessage({
        type: "danger",
        text: "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại!",
      });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <Card className="p-4 shadow-sm">
        {/* Nút quay lại */}
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

        {/* 🧍‍♂️ Thông tin cá nhân */}
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

        <hr className="my-4" />

        {/* Đổi mật khẩu */}
        <h5 className="fw-bold mb-3 text-success">Đổi mật khẩu</h5>
        {pwMessage && <Alert variant={pwMessage.type}>{pwMessage.text}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu hiện tại</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Nhập lại mật khẩu mới"
            />
          </Form.Group>

          <div className="text-center">
            <Button
              variant="success"
              style={{
                minWidth: "200px",
                backgroundColor: "#449D44",
                border: "none",
              }}
              onClick={handlePasswordSave}
              disabled={pwLoading}
            >
              {pwLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default EditProfileInfo;
