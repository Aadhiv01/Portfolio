import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faProjectDiagram,
  faRocket,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

const InspirationSection = () => {
  const inspirationItems = [
    {
      icon: faLightbulb,
      title: "Innovating Beyond Boundaries",
      description:
        "Pushing the envelope of what's possible in tech, I'm driven by the thrill of turning creative ideas into progressive solutions that reshape organizations and elevate user experiences.",
    },
    {
      icon: faRocket,
      title: "Pioneering the Unknown",
      description:
        "Embracing the unknown is my motivation for growth. I view each challenge as an opportunity to employ new methodologies, pushing the boundaries of software engineering and leaving a memorable impact.",
    },
    {
      icon: faProjectDiagram,
      title: "Architecting Tomorrow",
      description:
        "With a keen eye on emerging technologies and a mind for designing scalable architectures, I'm dedicated to building robust, flexible foundations that will support the next generation of transformative applications.",
    },
    {
      icon: faBrain,
      title: "AI-Powered Evolution",
      description:
        "Harnessing the synergy between human creativity and machine intelligence, I'm excited to build futuristic products where AI seamlessly augments our capabilities, unlocking boundless potential in software development.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="header"
      >
        Inspiration & Vision
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {inspirationItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="group relative border border-accent/10 rounded-xl p-8 hover:border-purple-500 transition-all duration-500 overflow-hidden"
          >
            {/* Border Pipeline Animation (Purple-400) */}
            <div className="absolute inset-0 w-full h-full border-2 border-transparent group-hover:border-purple-500 transition-all duration-500"></div>

            {/* Top-Left Corner */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            {/* Bottom-Right Corner */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 relative"
              >
                {/* ICON with hover effect */}
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-5xl text-accent group-hover:text-purple-500 transition-colors duration-300 group-hover:scale-110 transform transition-all duration-500"
                />
                <div className="absolute -inset-4 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>

              <h3 className="text-2xl font-semibold mb-4 text-heading group-hover:text-purple-500 transition-colors duration-300">
                {item.title}
              </h3>

              <p className="text-text/80 leading-relaxed group-hover:font-bold transition-all duration-500">{item.description}</p>
            </div>

            {/* Hover Underline Animation */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-2/3 transition-all duration-500"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InspirationSection;
