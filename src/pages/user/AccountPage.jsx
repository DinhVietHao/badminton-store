import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";

const AccountPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // ✅ Nếu là admin, điều hướng đến layout admin
    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    // ✅ Nếu id không khớp, quay lại đúng trang cá nhân
    if (String(user.id) !== id) {
      navigate(`/profile/${user.id}`);
      return;
    }

    setProfileData(user);
  }, [user, id, navigate]);

  if (!profileData) return null;

  const orders = []; // TODO: fetch đơn hàng thực từ API sau

  return (
    <Container className="py-5">
      <h3 className="mb-3 text-uppercase fw-bold">THÔNG TIN TÀI KHOẢN</h3>

      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <p>
        Xin chào,{" "}
        <span className="text-success fw-semibold">
          {profileData.fullname || profileData.username}
        </span>
      </p>

      <Row className="mt-4 g-4">
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title className="fw-bold text-uppercase mb-4">
                Thông tin khách hàng
              </Card.Title>
              <div className="mb-3">
                <strong>👤 Họ tên:</strong> {profileData.fullname}
              </div>
              <div className="mb-3">
                <strong>📞 Số ĐT:</strong>{" "}
                {profileData.phone || "Chưa cập nhật"}
              </div>
              <div className="mb-3">
                <strong>📍 Địa chỉ:</strong>{" "}
                {profileData.address || "Chưa cập nhật"}
              </div>
              <Button
                variant="success"
                className="fw-semibold text-white"
                style={{ backgroundColor: "#449D44", border: "none" }}
                onClick={() => navigate(`/profile/${id}/edit`)}
              >
                Sửa thông tin
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card>
            <Card.Body>
              <Card.Title className="fw-bold text-uppercase mb-4">
                Đơn hàng của bạn
              </Card.Title>
              <Table bordered hover responsive>
                <thead
                  className="text-center align-middle"
                  style={{ backgroundColor: "#d9f2d9" }}
                >
                  <tr style={{ backgroundColor: "#449D44", color: "white" }}>
                    <th>Đơn hàng</th>
                    <th>Ngày</th>
                    <th>Địa chỉ</th>
                    <th>Giá trị</th>
                    <th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4 text-muted">
                        Không có đơn hàng nào.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.address}</td>
                        <td>{order.total}₫</td>
                        <td>{order.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountPage;
