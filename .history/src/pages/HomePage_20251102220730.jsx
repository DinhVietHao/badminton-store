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
              <FaShippingFast size={28} color="#449D44" className="mb-2" />
              <h6 className="fw-bold text-uppercase mb-1">
                Vận chuyển toàn quốc
              </h6>
              <p className="text-muted small mb-0">Thanh toán khi nhận hàng</p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaWallet size={28} color="#449D44" className="mb-2" style={}/>
              <h6 className="fw-bold text-uppercase mb-1">
                Bảo đảm chất lượng
              </h6>
              <p className="text-muted small mb-0">
                Sản phẩm bảo đảm chất lượng
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaCreditCard size={28} color="#449D44" className="mb-2" />
              <h6 className="fw-bold text-uppercase mb-1">
                Thanh toán linh hoạt
              </h6>
              <p className="text-muted small mb-0">
                Với nhiều phương thức thanh toán
              </p>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-4 bg-white h-100 shadow-sm hover-shadow">
              <FaHeadset size={28} color="#449D44" className="mb-2" />
              <h6 className="fw-bold text-uppercase mb-1">
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

        {/* Khung nền xanh */}
        <div
          className="p-4 rounded-3 shadow-sm"
          style={{
            backgroundColor: "#449D44",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.15)",
          }}
        >
          {products.length > 1 ? (
            // Nếu có nhiều sản phẩm thì dùng Slider
            <Slider
              dots={false}
              infinite={products.length > 5}
              speed={500}
              slidesToShow={Math.min(products.length, 5)}
              slidesToScroll={1}
              arrows={products.length > 1}
              centerMode={false}
              centerPadding="0"
              className="text-start"
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
                    <Card
                      className="h-100 border-0 rounded-4 position-relative overflow-hidden"
                      style={{
                        backgroundColor: "#fff",
                        boxShadow:
                          "0 4px 8px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.10)",
                        transform: "translateY(0)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.25), 0 15px 35px rgba(0,0,0,0.20)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.10)";
                      }}
                    >
                      {/* 🎀 Ribbon giảm giá */}
                      {discountPercent > 0 && (
                        <div
                          className="position-absolute text-white fw-bold d-flex align-items-center justify-content-center"
                          style={{
                            top: "10px",
                            left: "10px",
                            backgroundColor: "#d0021b", // đỏ tươi kiểu TMĐT
                            borderTopRightRadius: "20px",
                            borderBottomRightRadius: "20px",
                            height: "28px",
                            padding: "0 12px 0 16px",
                            fontSize: "13px",
                            zIndex: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                            position: "relative",
                          }}
                        >
                          -{discountPercent}%{/* Cái đuôi nhỏ bên trái */}
                          <div
                            style={{
                              content: '""',
                              position: "absolute",
                              left: "-6px",
                              width: "0",
                              height: "0",
                              borderTop: "7px solid transparent",
                              borderBottom: "7px solid transparent",
                              borderRight: "6px solid #d0021b",
                            }}
                          ></div>
                        </div>
                      )}

                      {/* Hình ảnh sản phẩm */}
                      <div
                        className="d-flex align-items-center justify-content-center bg-white"
                        style={{ height: "200px", overflow: "hidden" }}
                      >
                        <Card.Img
                          variant="top"
                          src={
                            product.thumbnailUrl
                              ? product.thumbnailUrl
                              : "/images/no-image.png"
                          }
                          alt={product.title}
                          className="p-3"
                          style={{
                            maxHeight: "180px",
                            objectFit: "contain",
                            width: "auto",
                          }}
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

                        <Button
                          variant="warning"
                          className="w-100 text-white fw-bold"
                        >
                          Thêm vào giỏ
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </Slider>
          ) : (
            // Nếu chỉ có 1 sản phẩm → hiển thị card bên trái
            <div className="d-flex justify-content-start">
              {products.map((product) => {
                const original = Number(product.originalPrice) || 0;
                const sale = Number(product.salePrice) || 0;
                const discountPercent =
                  original > 0 && sale > 0 && original > sale
                    ? Math.round(((original - sale) / original) * 100)
                    : 0;

                return (
                  <div
                    key={product.id}
                    className="p-2"
                    style={{ width: "220px" }}
                  >
                    <Card
                      className="h-100 border-0 rounded-4 position-relative"
                      style={{
                        backgroundColor: "#fff",
                        boxShadow:
                          "0 4px 8px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.10)",
                        transform: "translateY(0)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.25), 0 15px 35px rgba(0,0,0,0.20)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.10)";
                      }}
                    >
                      {discountPercent > 0 && (
                        <div
                          className="position-absolute text-white fw-bold d-flex align-items-center justify-content-center"
                          style={{
                            top: "10px",
                            left: "10px",
                            backgroundColor: "#d0021b", // đỏ tươi kiểu TMĐT
                            borderTopRightRadius: "20px",
                            borderBottomRightRadius: "20px",
                            height: "28px",
                            padding: "0 12px 0 16px",
                            fontSize: "13px",
                            zIndex: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                            position: "relative",
                          }}
                        >
                          -{discountPercent}%{/* Cái đuôi nhỏ bên trái */}
                          <div
                            style={{
                              content: '""',
                              position: "absolute",
                              left: "-6px",
                              width: "0",
                              height: "0",
                              borderTop: "7px solid transparent",
                              borderBottom: "7px solid transparent",
                              borderRight: "6px solid #d0021b",
                            }}
                          ></div>
                        </div>
                      )}

                      <div
                        className="d-flex align-items-center justify-content-center bg-white"
                        style={{ height: "200px", overflow: "hidden" }}
                      >
                        <Card.Img
                          variant="top"
                          src={
                            product.thumbnailUrl
                              ? product.thumbnailUrl
                              : "/images/no-image.png"
                          }
                          alt={product.title}
                          className="p-3"
                          style={{
                            maxHeight: "180px",
                            objectFit: "contain",
                            width: "auto",
                          }}
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
                        <Button
                          variant="warning"
                          className="w-100 text-white fw-bold"
                        >
                          Thêm vào giỏ
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
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
            const discountPercent =
              original > 0 && sale > 0 && original > sale
                ? Math.round(((original - sale) / original) * 100)
                : 0;

            return (
              <div
                key={product.id}
                className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex"
              >
                <Card
                  className="flex-fill border-0 rounded-4"
                  style={{
                    backgroundColor: "#fff",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.15), 0 12px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Ribbon giảm giá */}
                  {discountPercent > 0 && (
                    <div
                      className="position-absolute text-white fw-bold d-flex align-items-center justify-content-center"
                      style={{
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#d0021b",
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                        height: "26px",
                        padding: "0 12px 0 16px",
                        fontSize: "13px",
                        zIndex: 10,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                        position: "relative",
                      }}
                    >
                      -{discountPercent}%
                      <div
                        style={{
                          content: '""',
                          position: "absolute",
                          left: "-6px",
                          width: "0",
                          height: "0",
                          borderTop: "7px solid transparent",
                          borderBottom: "7px solid transparent",
                          borderRight: "6px solid #d0021b",
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Hình sản phẩm */}
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

                    <Button
                      variant="warning"
                      className="w-100 text-white fw-bold"
                    >
                      Thêm vào giỏ
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Nút xem thêm */}
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
