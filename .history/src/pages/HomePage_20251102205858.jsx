import { useEffect, useState } from "react";
import { Carousel as BSCarousel, Card, Button, Spinner } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

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

  const fmt = (value) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString()
      : "0";

  // Cấu hình carousel
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 2,
    },
  };

  return (
    <div>
      {/* ========== Banner Carousel ========== */}
      <BSCarousel>
        {images.map((img) => (
          <BSCarousel.Item key={img.id}>
            <img className="d-block w-100" src={img.imageUrl} alt={img.alt} />
            <BSCarousel.Caption>
              <h3>{img.alt}</h3>
              <p>Khám phá sản phẩm mới nhất.</p>
            </BSCarousel.Caption>
          </BSCarousel.Item>
        ))}
      </BSCarousel>

      {/* ========== Product Carousel ========== */}
      <section className="container my-5">
        <h2 className="fw-bold mb-4 border-start border-4 border-warning ps-3">
          Sản phẩm mới
        </h2>

        <Carousel
          responsive={responsive}
          infinite
          autoPlay={false}
          keyBoardControl
          itemClass="px-2"
          containerClass="carousel-container"
          arrows
        >
          {products.map((product) => {
            const original = Number(product.originalPrice) || 0;
            const sale = Number(product.salePrice) || 0;
            let discountPercent = 0;
            if (original > 0 && sale > 0 && original > sale) {
              discountPercent = Math.round(
                ((original - sale) / original) * 100
              );
            }

            return (
              <Card
                key={product.id}
                className="shadow-sm border-0 rounded-3 h-100 position-relative"
              >
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
            );
          })}
        </Carousel>
      </section>
    </div>
  );
};

export default HomePage;
