import { useEffect, useState } from "react";
import {
  Carousel as BSCarousel,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";
import {
  FaShippingFast,
  FaWallet,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";

const HomePage = () => {
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
        // Giả sử sản phẩm nổi bật là top 30 đầu tiên
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

  const fmt = (value) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString()
      : "0";

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 5 },
    desktop: { breakpoint: { max: 1200, min: 992 }, items: 4 },
    tablet: { breakpoint: { max: 992, min: 768 }, items: 3 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 2 },
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

      {/* ========== Service Info Bar ========== */}
      <section className="container my-5">
        <div className="row g-3 text-center">
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaShippingFast size={28} color="#ff6600" className="mb-2" />
              <h6 className="fw-bold text-uppercase text-warning mb-1">
                Vận chuyển toàn quốc
              </h6>
              <p className="text-muted small mb-0">Thanh toán khi nhận hàng</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaWallet size={28} color="#ff6600" className="mb-2" />
              <h6 className="fw-bold text-uppercase text-warning mb-1">
                Bảo đảm chất lượng
              </h6>
              <p className="text-muted small mb-0">
                Sản phẩm bảo đảm chất lượng
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaCreditCard size={28} color="#ff6600" className="mb-2" />
              <h6 className="fw-bold text-uppercase text-warning mb-1">
                Thanh toán linh hoạt
              </h6>
              <p className="text-muted small mb-0">
                Với nhiều phương thức thanh toán
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaHeadset size={28} color="#ff6600" className="mb-2" />
              <h6 className="fw-bold text-uppercase text-warning mb-1">
                Đổi sản phẩm mới
              </h6>
              <p className="text-muted small mb-0">Nếu sản phẩm lỗi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Product Carousel ========== */}
      <section className="container my-5">
        <h2 className="fw-bold mb-4 border-start border-4 border-warning ps-3">
          Sản phẩm mới
        </h2>

        <div
          className="p-4 rounded-3 shadow-sm"
          style={{ backgroundColor: "#449D44" }} // ✅ nền xanh bao quanh sản phẩm
        >
          <Slider
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={5}
            slidesToScroll={1}
            centerMode={false} // ✅ tắt căn giữa
            centerPadding="0"
            arrows={true}
            responsive={[
              { breakpoint: 1200, settings: { slidesToShow: 4 } },
              { breakpoint: 992, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 576, settings: { slidesToShow: 1 } },
            ]}
          >
            {products.map((product) => {
              const original = Number(product.originalPrice) || 0;
              const sale = Number(product.salePrice) || 0;
              const discountPercent =
                original > 0 && sale > 0 && original > sale
                  ? Math.round(((original - sale) / original) * 100)
                  : 0;

              return (
                <div key={product.id} className="p-2">
                  <Card className="h-100 border-0 shadow-sm rounded-3">
                    {discountPercent > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute"
                        style={{
                          top: "10px",
                          left: "10px",
                          borderRadius: "6px",
                          zIndex: 10,
                        }}
                      >
                        -{discountPercent}%
                      </Badge>
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
                        <span className="text-danger fw-bold">
                          {fmt(sale)}₫
                        </span>{" "}
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
                </div>
              );
            })}
          </Slider>
        </div>
      </section>

      {/* ========== Featured Products ========== */}
      <section className="container my-5">
        <h2 className="fw-bold mb-4 border-start border-4 border-danger ps-3">
          Sản phẩm nổi bật
        </h2>

        <div className="row g-4">
          {featuredProducts.slice(0, showMore ? 30 : 10).map((product) => {
            const original = Number(product.originalPrice) || 0;
            const sale = Number(product.salePrice) || 0;
            return (
              <div
                key={product.id}
                className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex"
              >
                <Card className="flex-fill shadow-sm border-0 rounded-3 hover-shadow">
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
                    <Button variant="outline-warning" className="w-100">
                      Thêm vào giỏ
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4">
          {!showMore ? (
            <Button
              variant="danger"
              onClick={() => setShowMore(true)}
              className="px-4"
            >
              Xem thêm
            </Button>
          ) : (
            <Button
              variant="outline-secondary"
              onClick={() => setShowMore(false)}
              className="px-4"
            >
              Thu gọn
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
