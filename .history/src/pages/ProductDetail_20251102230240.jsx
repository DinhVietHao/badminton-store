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
} from "react-bootstrap";

const ProductDetailPage = () => {
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);

  const fetchHomePage = async () => {
    try {
      const res = await fetch("http://localhost:5000/homePage");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        setFeaturedProducts(data.slice(0, 30));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchHomePage();
    fetchProducts();
  }, []);

  if (error) return <p className="text-danger">Error: {error}</p>;
  if (images.length === 0 && products.length === 0)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" /> <p>Loading...</p>
      </div>
    );

  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="warning">Sản phẩm không tồn tại</Alert>;

  const fmt = (v) => v.toLocaleString("vi-VN");

  const discount =
    product.originalPrice > product.salePrice
      ? Math.round(
          ((product.originalPrice - product.salePrice) /
            product.originalPrice) *
            100
        )
      : 0;

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
              src={activeImage}
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
          onSelect={(k) => setActiveTab(k || "description")}
          className="mb-3 fw-semibold"
          fill
        >
          <Tab eventKey="description" title="Mô tả sản phẩm">
            <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
          </Tab>

          <Tab eventKey="specs" title="Thông số kỹ thuật">
            <table className="table table-bordered mt-3">
              <tbody>
                <tr>
                  <th>Trình độ chơi</th>
                  <td>
                    {product.playerLevel === "advanced"
                      ? "Trung Bình / Nâng Cao"
                      : "Cơ bản"}
                  </td>
                </tr>
                <tr>
                  <th>Phong cách chơi</th>
                  <td>
                    {product.playingStyle === "offensive"
                      ? "Tấn công"
                      : "Phòng thủ"}
                  </td>
                </tr>
                <tr>
                  <th>Chiều dài vợt</th>
                  <td>{product.length}</td>
                </tr>
                <tr>
                  <th>Độ cứng đũa</th>
                  <td>
                    {product.shaftFlexibility === "extraStiff" ? "Cứng" : "Mềm"}
                  </td>
                </tr>
                <tr>
                  <th>Điểm cân bằng</th>
                  <td>
                    {product.balancePoint === "headHeavy"
                      ? "Nặng đầu"
                      : "Cân bằng"}
                  </td>
                </tr>
                <tr>
                  <th>Trọng lượng</th>
                  <td>{product.weight}</td>
                </tr>
              </tbody>
            </table>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default ProductDetailPage;
