import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Tabs,
  Tab,
  Spinner,
  Alert,
  Fade,
} from "react-bootstrap";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState({});
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [error, setError] = useState("");
  const [isTabVisible, setIsTabVisible] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/products/$`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setError("Dữ liệu sản phẩm không hợp lệ");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  console.log("hiihihihih" + products);
  // tìm product theo id
  const product = products.find((p) => p.id == id);

  // cập nhật ảnh chính khi có product
  useEffect(() => {
    if (product && !activeImage) {
      setActiveImage(product.thumbnailUrl);
    }
  }, [product]);

  if (error)
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">Lỗi: {error}</Alert>
      </Container>
    );

  if (products.length === 0)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );

  if (!product)
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">Sản phẩm không tồn tại</Alert>
      </Container>
    );

  const fmt = (v) => v.toLocaleString("vi-VN");

  const discount =
    product.originalPrice > product.salePrice
      ? Math.round(
          ((product.originalPrice - product.salePrice) /
            product.originalPrice) *
            100
        )
      : 0;

  // hiệu ứng chuyển tab
  const handleTabChange = (key) => {
    setIsTabVisible(false);
    setTimeout(() => {
      setActiveTab(key || "description");
      setIsTabVisible(true);
    }, 150);
  };

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* ====== Left: Image Section ====== */}
        <Col md={5}>
          <div className="position-relative bg-white rounded shadow-sm p-3">
            {discount > 0 && (
              <div
                className="position-absolute text-white fw-bold px-3 py-1"
                style={{
                  top: "15px",
                  left: "0",
                  backgroundColor: "#d32f2f",
                  borderTopRightRadius: "20px",
                  borderBottomRightRadius: "20px",
                  fontSize: "0.9rem",
                  zIndex: 10,
                }}
              >
                -{discount}%
              </div>
            )}
            <Image
              src={activeImage || product.thumbnailUrl}
              alt={product.title}
              fluid
              className="w-100"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>

          {/* Gallery images */}
          <div className="d-flex mt-3 gap-2 justify-content-center">
            {[product.thumbnailUrl, ...(product.gallery || [])].map(
              (img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`border rounded p-1 cursor-pointer ${
                    img === activeImage ? "border-danger" : "border-light"
                  }`}
                  style={{
                    width: "70px",
                    height: "70px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={img}
                    alt={`Hình ${i + 1}`}
                    fluid
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              )
            )}
          </div>
        </Col>

        {/* ====== Right: Product Info ====== */}
        <Col md={7}>
          <h4 className="fw-bold mb-2">{product.title}</h4>
          <div className="text-muted mb-1">
            Mã: <span className="fw-semibold text-dark">{product.sku}</span>
          </div>
          <div className="text-muted mb-3">
            Thương hiệu:{" "}
            <span className="fw-semibold text-dark">{product.brand}</span>
          </div>

          <h4 className="text-danger fw-bold">{fmt(product.salePrice)} ₫</h4>
          {product.originalPrice > 0 && (
            <div className="text-muted text-decoration-line-through">
              Giá niêm yết: {fmt(product.originalPrice)} ₫
            </div>
          )}

          {/* ====== Promotion box ====== */}
          <div className="mt-4 p-3 border border-warning rounded bg-light-subtle">
            <h6 className="fw-bold text-danger mb-2">🎁 ƯU ĐÃI</h6>
            <ul className="list-unstyled mb-0">
              <li>🎯 Tặng 2 Quấn cán vợt Cầu Lông VNB 001 hoặc Joto 001</li>
              <li>🛠️ Sơn logo mặt vợt miễn phí</li>
              <li>🔧 Bảo hành lưới đan trong 72 giờ</li>
              <li>💬 Thay gen vợt miễn phí trọn đời</li>
            </ul>
          </div>

          {/* ====== Buttons ====== */}
          <div className="d-flex gap-3 mt-4">
            <Button variant="danger" size="lg" className="flex-fill fw-bold">
              Mua ngay
            </Button>
            <Button
              variant="outline-warning"
              size="lg"
              className="flex-fill fw-bold"
            >
              Thêm vào giỏ
            </Button>
          </div>
        </Col>
      </Row>

      {/* ====== Tabs: Description & Specification ====== */}
      <div className="mt-5 bg-white rounded-3 shadow-sm p-4">
        <Tabs
          id="product-detail-tabs"
          activeKey={activeTab}
          onSelect={handleTabChange}
          className="mb-3 fw-semibold"
          fill
        >
          <Tab eventKey="description" title="Mô tả sản phẩm" />
          <Tab eventKey="specs" title="Thông số kỹ thuật" />
        </Tabs>

        <Fade in={isTabVisible} appear>
          <div>
            {activeTab === "description" && (
              <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
            )}
            {activeTab === "specs" && (
              <table className="table table-bordered mt-3">
                <tbody>
                  <tr>
                    <th>Trình độ chơi</th>
                    <td>
                      {product.playerLevel === "Người mới bắt đầu"
                        ? "Người mới bắt đầu"
                        : product.playerLevel === "Trung cấp"
                        ? "Trung cấp"
                        : "Chuyên nghiệp"}
                    </td>
                  </tr>
                  <tr>
                    <th>Phong cách chơi</th>
                    <td>
                      {product.playingStyle === "Tấn công"
                        ? "Tấn công"
                        : product.playingStyle === "Phòng thủ"
                        ? "Phòng thủ"
                        : "Toàn diện"}
                    </td>
                  </tr>
                  <tr>
                    <th>Nội dung chơi</th>
                    <td>
                      {product.playType === "Đánh đơn và đôi"
                        ? "Đánh đơn và đôi"
                        : product.playType === "Đánh đơn"
                        ? "Đánh đơn"
                        : "Đánh đôi"}
                    </td>
                  </tr>
                  <tr>
                    <th>Chiều dài vợt</th>
                    <td>{product.length}</td>
                  </tr>
                  <tr>
                    <th>Độ cứng đũa</th>
                    <td>
                      {product.shaftFlexibility === "Cứng"
                        ? "Cứng"
                        : product.shaftFlexibility === "Trung bình"
                        ? "Trung bình"
                        : product.shaftFlexibility === "Trung bình"
                        ? "Dẻo"
                        : "Siêu cứng"}
                    </td>
                  </tr>
                  <tr>
                    <th>Điểm cân bằng</th>
                    <td>
                      {product.balancePoint === "Nặng đầu"
                        ? "Nặng đầu"
                        : product.balancePoint === "Nhẹ đầu"
                        ? "Nhẹ đầu"
                        : "Cân bằng"}
                    </td>
                  </tr>
                  <tr>
                    <th>Trọng lượng</th>
                    <td>{product.weight}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </Fade>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
