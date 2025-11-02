import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";

const HomePage = () => {
  const [image, setImage] = useState({});

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

  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner/1000z-launch-website-banner_1695177885.webp"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Yonex 1000Z Launch</h3>
            <p>Lực đánh mạnh mẽ, thiết kế cao cấp.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner/victor-axelsen_1759089349.webp"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Victor Axelsen</h3>
            <p>Phong cách thi đấu mạnh mẽ và tốc độ.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/images/banner/yonex-astrox-99_1757731351.webp"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Yonex Astrox 99</h3>
            <p>Sức mạnh và độ chính xác tối đa.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default HomePage;
