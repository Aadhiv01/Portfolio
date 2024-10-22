import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faProjectDiagram,
  faRocket,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

const InspirationSection = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const inspirationItems = [
    {
      icon: faLightbulb,
      title: "Innovating Beyond Boundaries",
      description:
        "Pushing the envelope of what's possible in tech, I'm driven by the thrill of turning creative ideas into progessive solutions that reshape organizations and elevate iser experiences.",
      color: "#FFD700",
    },
    {
      icon: faRocket,
      title: "Pioneering the Unknown",
      description:
        "Embracing the unknown is my motivation for growth. I view each challenge as an opportunity to employ new methodologies, pushing the boundaries of software engineering and leaving a memorable impact.",
      color: "#FF4500",
    },
    {
      icon: faProjectDiagram,
      title: "Architecting Tomorrow",
      description:
        "With a keen eye on emerging technologies and a mind for designing scalable architectures, I'm dedicated to building robust, flexible foundations that will support the next generation of transformative applications.",
      color: "#32CD32",
    },
    {
      icon: faBrain,
      title: "AI-Powered Evolution",
      description:
        "Harnessing the synergy between human creativity and machine intelligence, I'm excited to build futuristic products where AI seamlessly augments our capabilities, unlocking boundless potential in software development.",
      color: "#4B0082",
    },
  ];

  return (
    <motion.div
      className="inspiration-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-4xl font-bold text-center mb-12 header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Inspiration & Vision
      </motion.h2>
      <div className="grid grid-cols-2 gap-8">
        {inspirationItems.map((item, index) => (
          <motion.div
            key={index}
            className="inspiration-item relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${item.color}22, ${item.color}44)`,
              border: `2px solid ${item.color}88`,
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="p-6 h-full flex flex-col justify-between z-10 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-5xl mb-4"
                  style={{ color: item.color }}
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-0 transition-opacity duration-300"
              animate={{ opacity: hoveredItem === index ? 0.7 : 0 }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default InspirationSection;