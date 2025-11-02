import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";

const HomePage = () => {
  const [imagess, setImage] = useState([]);

  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const contentFetch = await fetch("http://localhost:5000/homePage");
      const data = await contentFetch.json();
      setImage(data);
      console.log(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (images.length === 0) return <p>Loading...</p>; // ✅ tránh lỗi khi chưa có dữ liệu

  return (
    <div>
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
    </div>
  );
};

export default HomePage;
