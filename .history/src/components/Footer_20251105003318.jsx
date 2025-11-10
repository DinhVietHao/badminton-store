import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        borderTop: "3px solid #449D44",
        marginTop: "40px",
        paddingTop: "40px",
      }}
    >
      <Container>
        <Row style={{ textAlign: "left" }}>
          {/* Cột 1 - Logo và giới thiệu */}
          <Col md={3} sm={6} className="mb-4">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/images/logo/logo.png"
                alt="logo"
                style={{ height: "45px", marginRight: "10px" }}
              />
              <h5 style={{ color: "#449D44", fontWeight: "bold" }}>
                Badminton Shop
              </h5>
            </div>
            <p
              style={{ marginTop: "10px", color: "#555", fontSize: "0.95rem" }}
            >
              Hệ thống cửa hàng cầu lông chuyên nghiệp – nơi bạn tìm thấy mọi
              thứ cho đam mê thể thao của mình.
            </p>
          </Col>

          {/* Cột 2 - Hỗ trợ */}
          <Col md={3} sm={6} className="mb-4">
            <h6
              style={{
                color: "#449D44",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              HỖ TRỢ KHÁCH HÀNG
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link
                  to="/about"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/policy"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  to="/return"
                  style={{
                    textDecoration: "none",
                    color: "#333",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Đổi trả & hoàn tiền
                </Link>
              </li>
            </ul>
          </Col>

          {/* Cột 3 - Liên hệ */}
          <Col md={3} sm={6} className="mb-4">
            <h6
              style={{
                color: "#449D44",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              LIÊN HỆ
            </h6>
            <p style={{ color: "#333", marginBottom: "6px" }}>
              <FaPhone style={{ color: "#449D44", marginRight: "8px" }} />
              Hotline: 0919 301 337
            </p>
            <p style={{ color: "#333", marginBottom: "6px" }}>
              <FaEnvelope style={{ color: "#449D44", marginRight: "8px" }} />
              Email: support@badmintonshop.vn
            </p>
            <p style={{ color: "#333", marginBottom: "6px" }}>
              123 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ
            </p>
          </Col>

          {/* Cột 4 - Mạng xã hội */}
          <Col md={3} sm={6} className="mb-4">
            <h6
              style={{
                color: "#449D44",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              KẾT NỐI VỚI CHÚNG TÔI
            </h6>
            <div style={{ display: "flex", gap: "15px" }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#449D44",
                  fontSize: "1.4rem",
                  textDecoration: "none",
                }}
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#449D44",
                  fontSize: "1.4rem",
                  textDecoration: "none",
                }}
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        <hr style={{ borderTop: "1px solid #ccc" }} />

        {/* Bản quyền */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: "15px",
            color: "#555",
            fontSize: "0.95rem",
          }}
        >
          © 2025 Bản quyền thuộc về{" "}
          <span style={{ color: "#449D44", fontWeight: "600" }}>
            Badminton Shop
          </span>
          . All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
