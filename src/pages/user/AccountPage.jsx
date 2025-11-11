import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useParams, Navigate } from "react-router-dom";
import { FaUser, FaLock, FaShoppingBag, FaHeart, FaBell } from "react-icons/fa";
import { selectUser } from "../../redux/slices/authSlice";

const AccountPage = () => {
  const { id } = useParams();

  const user = useSelector(selectUser);

  if (!user || String(user.id) !== id) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    {
      icon: <FaUser />,
      title: "Thông tin cá nhân",
      description: "Quản lý thông tin tài khoản của bạn",
      link: `/profile/${id}/edit`,
      color: "primary",
    },
    {
      icon: <FaLock />,
      title: "Bảo mật",
      description: "Thay đổi mật khẩu và cài đặt bảo mật",
      link: `/profile/${id}/security`,
      color: "danger",
    },
    {
      icon: <FaShoppingBag />,
      title: "Đơn hàng của tôi",
      description: "Xem lịch sử và trạng thái đơn hàng",
      link: "/orders",
      color: "success",
    },
    {
      icon: <FaHeart />,
      title: "Sản phẩm yêu thích",
      description: "Danh sách sản phẩm bạn đã lưu",
      link: `/profile/${id}/favorites`,
      color: "warning",
    },
    {
      icon: <FaBell />,
      title: "Thông báo",
      description: "Cập nhật về đơn hàng và khuyến mãi",
      link: `/profile/${id}/notifications`,
      color: "info",
    },
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Tài khoản của tôi</h2>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm text-center p-4">
            <div className="mb-3">
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                style={{ width: "80px", height: "80px", fontSize: "2rem" }}
              >
                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
            <h4 className="mb-1">{user.fullName}</h4>
            <p className="text-muted mb-0">@{user.username}</p>
            <p className="text-muted">{user.email}</p>
          </Card>
        </Col>
      </Row>

      <Row>
        {menuItems.map((item, index) => (
          <Col md={6} key={index} className="mb-3">
            <Card
              as={Link}
              to={item.link}
              className="shadow-sm h-100 text-decoration-none"
              style={{
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #e0e0e0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <Card.Body className="d-flex align-items-start">
                <div
                  className={`bg-${item.color} text-white rounded p-3 me-3`}
                  style={{ fontSize: "1.5rem" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h5 className="mb-1 text-dark">{item.title}</h5>
                  <p className="text-muted mb-0 small">{item.description}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AccountPage;
