import React, { useState, useEffect } from "react";

import 'CSS/IlluminatedArea.css';

const IlluminatedArea = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Update the position of the illuminated area based on the mouse pointer
  const onMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    // Add an event listener to track mouse movement
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      className="illuminated-area"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    ></div>
  );
};

export default IlluminatedArea;
