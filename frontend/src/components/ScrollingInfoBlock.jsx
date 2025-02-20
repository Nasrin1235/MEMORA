import { useState } from "react";
import "../styles/ScrollingInfoBlock.css";

const ScrollingInfoBlock = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    { src: "scroll12.jpg", text: "Venice gondola ride." },
    { src: "scroll3.jpg", text: "Sunset reflections." },
    { src: "scroll2.jpg", text: "Historic bridge." },
    { src: "scroll4.jpg", text: "Night lights." },
    { src: "scroll5.jpg", text: "Gondolier at work." },
    { src: "scroll7.jpg", text: "Scenic view." },
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










