import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        borderTop: "2px solid #4CAF50",
        marginTop: "40px",
        paddingTop: "30px",
        paddingBottom: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center text-center text-md-start">
          <Col md={3} sm={12} className="mb-3">
            <div className="d-flex flex-column align-items-center align-items-md-start">
              <img
                src="/images/logo/logo.png"
                alt="Badminton Shop"
                style={{ width: "60px", marginBottom: "10px" }}
              />
              <h5 className="text-success fw-bold">Badminton Shop</h5>
              <p style={{ fontSize: "14px", color: "#555" }}>
                Hệ thống cửa hàng cầu lông chuyên nghiệp — nơi bạn tìm thấy mọi
                thứ cho đam mê thể thao của mình.
              </p>
            </div>
          </Col>

          <Col md={2} sm={6} className="mb-3">
            <h6 className="text-success fw-bold mb-3">HỖ TRỢ KHÁCH HÀNG</h6>
            <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
              <li>Giới thiệu</li>
              <li>Chính sách bảo hành</li>
              <li>Chính sách vận chuyển</li>
              <li>Đổi trả & hoàn tiền</li>
            </ul>
          </Col>

          <Col md={3} sm={6} className="mb-3">
            <h6 className="text-success fw-bold mb-3">LIÊN HỆ</h6>
            <p style={{ margin: 0 }}>
              <Phone size={16} className="me-2 text-success" />
              0919 301 337
            </p>
            <p style={{ margin: 0 }}>
              <Mail size={16} className="me-2 text-success" />
              support@badmintonshop.vn
            </p>
            <p style={{ fontSize: "14px", color: "#555", marginTop: "6px" }}>
              123 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ
            </p>
          </Col>

          <Col md={2} sm={12} className="text-center text-md-start mb-3">
            <h6 className="text-success fw-bold mb-3">KẾT NỐI VỚI CHÚNG TÔI</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <button
                type="button"
                onClick={() => {}}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4CAF50",
                  cursor: "pointer",
                }}
                aria-label="Facebook"
              >
                <Facebook />
              </button>

              <button
                type="button"
                onClick={() => {}}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4CAF50",
                  cursor: "pointer",
                }}
                aria-label="Instagram"
              >
                <Instagram />
              </button>
            </div>
          </Col>
        </Row>

        <hr className="my-3" />
        <p className="text-center" style={{ fontSize: "14px", color: "#777" }}>
          © 2025 Bản quyền thuộc về{" "}
          <span className="text-success fw-semibold">Badminton Shop</span>. All
          rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
