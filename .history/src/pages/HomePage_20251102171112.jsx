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
            src={image[0].imageUrl}
            alt={image[0].alt}
          />
          <Carousel.Caption>
            <h3>Yonex 1000Z Launch</h3>
            <p>Lực đánh mạnh mẽ, thiết kế cao cấp.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image[1].imageUrl}
            alt={image[1].alt}
          />
          <Carousel.Caption>
            <h3>Victor Axelsen</h3>
            <p>Phong cách thi đấu mạnh mẽ và tốc độ.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image[2].imageUrl}
            alt={image[1].alt}
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
