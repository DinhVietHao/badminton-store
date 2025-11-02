import { useEffect, useState } from "react";
import { Carousel, Card, Button, Badge } from "react-bootstrap";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch dữ liệu banner
  const fetchHomePage = async () => {
    try {
      const res = await fetch("http://localhost:5000/homePage");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch dữ liệu sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchHomePage();
    fetchProducts();
  }, []);

  if (error) return <p className="text-danger">Error: {error}</p>;
  if (images.length === 0 && products.length === 0) return <p>Loading...</p>;

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

        <div className="row g-4">
          {products.map((product) => {
            // ✅ Tính phần trăm giảm giá
            const discountPercent = Math.round(
              ((product.originalPrice - product.salePrice) /
                product.originalPrice) *
                100
            );

            return (
              <div
                key={product.id}
                className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex"
              >
                <Card className="flex-fill shadow-sm border-0 rounded-3 hover-shadow transition-all position-relative">
                  {/* 🔻 Hiển thị % giảm giá */}
                  {discountPercent > 0 && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2 fs-6"
                    >
                      -{discountPercent}%
                    </Badge>
                  )}

                  <div className="ratio ratio-1x1">
                    <Card.Img
                      variant="top"
                      src={
                        product.thumbnailUrl
                          ? product.thumbnailUrl
                          : "/images/no-image.png"
                      }
                      alt={product.title}
                      className="object-fit-contain p-3"
                    />
                  </div>

                  <Card.Body>
                    <Card.Title
                      className="fs-6 text-truncate"
                      title={product.title}
                    >
                      {product.title}
                    </Card.Title>

                    <div className="mb-2">
                      <span className="text-danger fw-bold">
                        {product.salePrice.toLocaleString()}₫
                      </span>{" "}
                      <span className="text-muted text-decoration-line-through small">
                        {product.originalPrice.toLocaleString()}₫
                      </span>
                    </div>

                    <Button variant="warning" className="w-100 text-white">
                      Thêm vào giỏ
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
