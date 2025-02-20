import { useState } from "react";
import "../styles/ScrollingInfoBlock.css";

const ScrollingInfoBlock = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    { src: "henry-co--5IYF4pmMdY-unsplash (1).jpg"},
    { src: "joanna-kosinska-spAkZnUleVw-unsplash.jpg"},
    { src: "alessio-soggetti-KQBsTXCvGwM-unsplash.jpg" },
    { src: "debby-hudson-1tCQcTjLoRQ-unsplash.jpg" },
    { src: "onur-kayaci-BQbFBjEwK04-unsplash.jpg" },
    { src: "sebastian-pichler-MDGpwpMY2Ws-unsplash.jpg" },
    
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










