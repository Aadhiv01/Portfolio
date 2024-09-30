import React from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';

const ParallaxSection = ({ children, backgroundImage }) => {
  const { scrollY } = useViewportScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);

  return (
    <div className="parallax-section">
      <motion.div 
        className="parallax-background"
        style={{ 
          y,
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <div className="parallax-content">
        {children}
      </div>
      <style jsx>{`
        .parallax-section {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }
        .parallax-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120%;
          background-size: cover;
          background-position: center;
          z-index: -1;
        }
        .parallax-content {
          position: relative;
          z-index: 1;
          padding: 50px;
          color: var(--text-color);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

export default ParallaxSection;