import React, { useState, useEffect } from 'react';
import './CSS/MouseFollowFocus.css';

const MouseFollowFocus = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="focus"
      style={{ left: position.x, top: position.y }}
    ></div>
  );
};

export default MouseFollowFocus;
