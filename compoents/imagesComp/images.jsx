import React, { useRef, useState, useEffect } from "react";

const Images = ({ images }) => {
  const imageBoxRef = useRef(null);
  const originalRef = useRef(null);
  const magnifiedRef = useRef(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);

  const handleMouseMove = (e) => {
    const imageBox = imageBoxRef.current;
    const original = originalRef.current;
    const magnified = magnifiedRef.current;

    if (!imageBox || !original || !magnified) return;

    const rect = imageBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imgWidth = original.offsetWidth;
    const imgHeight = original.offsetHeight;

    // Calculate percentage position
    const xperc = (x / imgWidth) * 100;
    const yperc = (y / imgHeight) * 100;

    // Set background position for zoom effect
    magnified.style.backgroundPositionX = `${xperc}%`;
    magnified.style.backgroundPositionY = `${yperc}%`;

    // Position the magnifier circle
    magnified.style.left = `${x}px`;
    magnified.style.top = `${y}px`;
  };

  const handleMouseEnter = () => {
    setIsZoomVisible(true);
  };

  const handleMouseLeave = () => {
    setIsZoomVisible(false);
  };

  // Default image if none provided
  const [imageToUse, setImageToUse] = useState(images[0]);

  // check if screen is small
  const [smallScreen, setSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSmallScreen(true);
      } else {
        setSmallScreen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: smallScreen ? "300px" : "600px",
        padding: "0 1rem",
      }}
    >
      <div
        ref={imageBoxRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: smallScreen ? "250px" : "500px",
          height: "auto",
          position: "relative",
          cursor: isZoomVisible ? "zoom-in" : "default",
          margin: "0 auto",
        }}
      >
        <img
          ref={originalRef}
          src={imageToUse}
          alt="Zoomable"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "8px",
          }}
        />

        <div
          ref={magnifiedRef}
          style={{
            width: "400px",
            height: "340px",
            backgroundImage: `url(${imageToUse})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "#fff",
            backgroundSize: "300% auto", // Match the original image width
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
            pointerEvents: "none",
            position: "absolute",
            opacity: isZoomVisible ? 1 : 0,
            border: "4px solid #f5f5f5",
            zIndex: 99,
            borderRadius: "50%",
            transition: "opacity 0.2s ease-in-out",
            transform: "translate(-50%, -50%)", // Center the magnifier on cursor
          }}
        />
      </div>

      {/* Demo with multiple images */}
      {images.length > 1 && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "1rem" }}>
            Switch images:
          </p>
          <div
            style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border:
                    imageToUse === images[index]
                      ? "2px solid #007bff"
                      : "2px solid #ccc",
                }}
                onClick={() => {
                  setImageToUse(images[index]);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo component with sample images
const image = ({ images }) => {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "60vh",
      }}
    >
      <Images images={images} />
    </div>
  );
};

export default image;
