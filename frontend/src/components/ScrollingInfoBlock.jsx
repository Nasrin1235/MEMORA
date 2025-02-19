import { useState } from "react";
import "../styles/ScrollingInfoBlock.css";

const ScrollingInfoBlock = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Venice gondola ride." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Sunset reflections." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Historic bridge." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Night lights." },
  
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Gondolier at work." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Scenic view." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Misty morning." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "City lights reflection." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Venetian boat ride." },
    { src: "https://images.pexels.com/photos/417123/pexels-photo-417123.jpeg?auto=compress&cs=tinysrgb&w=600", text: "Historic architecture." },

  ];

  return (
    <div className="scrolling-info-container">
      {/* Текстовая секция */}
      <div className="info-text">
        <h2>Stories That Stay With Us</h2>
        <p>{hoveredIndex !== null ? images[hoveredIndex].text : "Hover over an image to see its story."}</p>
      </div>

      {/* Контейнер с изображениями */}
      <div className="info-image-container">
        <div className="scrollable-image">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Memory ${index + 1}`}
              className="grid-image"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingInfoBlock;








