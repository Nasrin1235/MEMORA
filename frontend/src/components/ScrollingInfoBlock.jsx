import { useState } from "react";
import "../styles/ScrollingInfoBlock.css";

const ScrollingInfoBlock = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    {
      src: "henry-co--5IYF4pmMdY-unsplash (1).jpg",
      text: "Drops of time, resting on memories we cherish.",
    },
    {
      src: "joanna-kosinska-spAkZnUleVw-unsplash.jpg",
      text: "Photographs are time capsules, holding the echoes of yesterday.",
    },
    {
      src: "alessio-soggetti-KQBsTXCvGwM-unsplash.jpg",
      text: "Like roses in the dark, our memories bloom even in silence.",
    },
    {
      src: "debby-hudson-1tCQcTjLoRQ-unsplash.jpg",
      text: "Pages filled with words, hearts filled with memories.",
    },
    {
      src: "onur-kayaci-BQbFBjEwK04-unsplash.jpg",
      text: "Sunsets remind us that endings can be just as beautiful as beginnings.",
    },
    {
      src: "johnny-briggs-GqY9r6xiQD8-unsplash.jpg",
      text: "Some places feel like home, even if you've never been there before.",
    },
  ];

  return (
    <div className="scrolling-info-container">
      <div className="info-image-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`image-wrapper ${index % 2 === 0 ? "right" : "left"}`}
          >
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

      <div className="info-text">
        <h2>Stories That Stay With Us</h2>
        <p>
          {hoveredIndex !== null
            ? images[hoveredIndex].text
            : "Hover over an image to see its story."}
        </p>
      </div>
    </div>
  );
};

export default ScrollingInfoBlock;
