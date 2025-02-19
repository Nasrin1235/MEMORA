import { useState } from "react";
import "../styles/ScrollingInfoBlock.css";

const ScrollingInfoBlock = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    { src: "henry-co--5IYF4pmMdY-unsplash (1).jpg", text: "Venice gondola ride." },
    { src: "alessio-soggetti-KQBsTXCvGwM-unsplash.jpg", text: "Sunset reflections." },
    { src: "ed-leszczynskl-KXNTfIg6rVM-unsplash.jpg", text: "Historic bridge." },
    { src: "matt-antonioli-jF6Jei40HkQ-unsplash.jpg", text: "Night lights." },
    { src: "alessio-soggetti-KQBsTXCvGwM-unsplash.jpg", text: "Gondolier at work." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Scenic view." },
  ];

  return (
    <div className="scrolling-info-container">
      <div className="info-text">
        <h2>Stories That Stay With Us</h2>
        <p>
          {hoveredIndex !== null
            ? images[hoveredIndex].text
            : "Hover over an image to see its story."}
        </p>
      </div>

      <div className="info-image-container">
        {images.map((image, index) => (
          <div key={index} className={`image-wrapper ${index % 2 === 0 ? "left" : "right"}`}>
            <img
              src={image.src}
              alt={`Memory ${index + 1}`}
              className="grid-image"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingInfoBlock;










