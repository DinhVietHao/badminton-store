import { useEffect, useState } from "react";
import { Carousel, Card, Button, Badge, Spinner } from "react-bootstrap";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch dữ liệu banner
  const fetchHomePage = async () => {
    try {
      const res = await fetch("http://localhost:5000/homePage");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch dữ liệu sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
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

  // Helper: format tiền an toàn
  const fmt = (value) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString()
      : "0";

  return (
    <div>
      {/* ========== Banner Carousel ========== */}
      <Carousel>
        {images.map((img) => (
          <Carousel.Item key={img.id}>
            <img className="d-block w-100" src={img.imageUrl} alt={img.alt} />
            <Carousel.Caption>
              <h3>{img.alt}</h3>
              <p>Khám phá sản phẩm mới nhất.</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ========== Product List ========== */}
      <section className="container my-5">
        <h2 className="fw-bold mb-4 border-start border-4 border-warning ps-3">
          Sản phẩm mới
        </h2>
        import { Carousel, Row, Col, Card, Button } from "react-bootstrap";

// Helper để chia mảng thành từng nhóm 5 phần tử
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// Trong return HomePage, thay thế phần sản phẩm cũ bằng:
<section className="container my-5">
  <h2 className="fw-bold mb-4 border-start border-4 border-warning ps-3">
    Sản phẩm mới
  </h2>

  <Carousel interval={null} indicators={false}>
    {chunkArray(products, 5).map((group, index) => (
      <Carousel.Item key={index}>
        <Row className="g-3">
          {group.map((product) => {
            const original = Number(product.originalPrice) || 0;
            const sale = Number(product.salePrice) || 0;
            let discountPercent = 0;
            if (original > 0 && sale > 0 && original > sale) {
              discountPercent = Math.round(((original - sale) / original) * 100);
            }
            return (
              <Col key={product.id} xs={6} sm={4} md={3} lg={2}>
                <Card className="h-100 shadow-sm border-0 rounded-3 position-relative overflow-hidden">
                  {discountPercent > 0 && (
                    <div
                      className="discount-badge"
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "0",
                        backgroundColor: "#d32f2f",
                        color: "white",
                        fontWeight: "600",
                        padding: "4px 12px 4px 8px",
                        borderTopRightRadius: "12px",
                        borderBottomRightRadius: "12px",
                        fontSize: "0.8rem",
                        zIndex: 5,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      -{discountPercent}%
                    </div>
                  )}
                  <div className="ratio ratio-1x1 bg-white">
                    <Card.Img
                      variant="top"
                      src={product.thumbnailUrl ? product.thumbnailUrl : "/images/no-image.png"}
                      alt={product.title}
                      className="object-fit-contain p-3"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fs-6 text-truncate" title={product.title}>
                      {product.title}
                    </Card.Title>
                    <div className="mb-2">
                      <span className="text-danger fw-bold">{fmt(sale)}₫</span>{" "}
                      {original > 0 && (
                        <span className="text-muted text-decoration-line-through small">
                          {fmt(original)}₫
                        </span>
                      )}
                    </div>
                    <Button variant="warning" className="w-100 text-white">
                      Thêm vào giỏ
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Carousel.Item>
    ))}
  </Carousel>
</section>

        
      </section>
    </div>
  );
};

export default HomePage;
