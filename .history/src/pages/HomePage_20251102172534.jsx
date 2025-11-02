import { useEffect, useState } from "react";
import { Carousel, Card, Button, Spinner } from "react-bootstrap";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch banner + product data
  const fetchData = async () => {
    try {
      const [homeRes, productRes] = await Promise.all([
        fetch("http://localhost:5000/homePage"),
        fetch("http://localhost:5000/products"),
      ]);

      const homeData = await homeRes.json();
      const productData = await productRes.json();

      setImages(homeData);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (images.length === 0 && products.length === 0)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" /> <p>Loading...</p>
      </div>
    );

  return (
    <div>
      {/* ========== Banner Carousel ========== */}
      <Carousel className="mb-5">
        {images.map((img) => (
          <Carousel.Item key={img.id}>
            <img
              className="d-block w-100"
              src={img.imageUrl}
              alt={img.alt}
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h3>{img.alt}</h3>
              <p>Khám phá sản phẩm mới nhất.</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ========== Product List ========== */}
      <section className="container mb-5">
        <h2 className="fw-bold mb-4 border-start border-4 border-warning ps-3">
          Sản phẩm mới
        </h2>

        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex"
            >
              <Card className="flex-fill shadow-sm border-0 rounded-3 hover-shadow transition-all">
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
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
