// src/pages/profile/AccountPage.js
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaShoppingBag,
  FaHeart,
  FaBell,
  FaCamera,
} from "react-icons/fa";
import axios from "axios";
import { selectUser, updateUser } from "../../redux/slices/authSlice";

const AccountPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [uploading, setUploading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fileInputRef = useRef(null);

  if (!user || String(user.id) !== id) {
    return <Navigate to="/login" replace />;
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const avatarBase64 = event.target.result;

      try {
        setUploading(true);
        const updatedUser = { ...user, avatar: avatarBase64 };

        // Gọi API backend
        const response = await axios.put(
          `http://localhost:5000/users/${user.id}`,
          updatedUser
        );

        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch(updateUser(response.data));
      } catch (err) {
        console.error("Lỗi khi cập nhật avatar:", err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

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
          <Card className="shadow-sm text-center p-4 position-relative">
            {/* Avatar ở giữa với overlay hover */}
            <div className="d-flex justify-content-center mb-3">
              <div
                className="position-relative d-inline-block"
                style={{ width: "120px", height: "120px" }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="rounded-circle border border-3 border-light"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      transition: "0.3s",
                      filter: hovered ? "brightness(70%)" : "brightness(100%)",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center border border-3 border-light"
                    style={{
                      width: "120px",
                      height: "120px",
                      fontSize: "2.5rem",
                      filter: hovered ? "brightness(70%)" : "brightness(100%)",
                      transition: "0.3s",
                    }}
                  >
                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                {/* Overlay hiển thị khi hover */}
                {hovered && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      borderRadius: "50%",
                      transition: "opacity 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={handleClickUpload}
                  >
                    <FaCamera size={22} color="white" />
                  </div>
                )}

                {/* Input upload ẩn */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="d-none"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Thông tin user */}
            <h4 className="mb-1">{user.fullName}</h4>
            <p className="text-muted mb-0">@{user.username}</p>
            <p className="text-muted">{user.email}</p>

            {uploading && (
              <p className="text-success small mt-2">Đang tải ảnh lên...</p>
            )}
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
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(0,0,0,0.1)";
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
