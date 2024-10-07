import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faLightbulb, faMountain, faRocket } from '@fortawesome/free-solid-svg-icons';

const AboutSection = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className=" text-white"
      initial="hidden"
      animate="visible"
      variants={fadeInUpVariants}
    >
      <motion.p 
        className="text-lg mb-6 leading-relaxed"
        variants={fadeInUpVariants}
      >
        As a visionary full-stack developer with over 3 years of experience, I'm on a mission to transform complex challenges into elegant, efficient solutions. My journey in tech is fueled by an insatiable curiosity and a passion for innovation.
      </motion.p>
      
      <motion.p 
        className="text-lg mb-8 leading-relaxed"
        variants={fadeInUpVariants}
      >
        I specialize in crafting seamless experiences from front-end to back-end, leveraging cutting-edge technologies to build scalable, robust applications that make a real impact. My expertise spans modern web frameworks, cloud computing, and AI integration, allowing me to create comprehensive solutions that push the boundaries of what's possible.
      </motion.p>

      <motion.h3 
        className="text-2xl font-bold mb-4 text-teal-300"
        variants={fadeInUpVariants}
      >
        What Drives Me
      </motion.h3>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: faCode, text: "Architecting clean, efficient code that solves real-world problems" },
          { icon: faLightbulb, text: "Continuous learning and staying at the forefront of tech innovation" },
          { icon: faRocket, text: "Pushing the limits of technology to create groundbreaking solutions" },
          { icon: faMountain, text: "Embracing complex challenges as opportunities for growth" }
        ].map((item, index) => (
          <motion.li 
            key={index}
            className="flex items-start space-x-3 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg"
            variants={fadeInUpVariants}
            transition={{ delay: index * 0.1 }}
          >
            <FontAwesomeIcon icon={item.icon} className="text-teal-400 text-xl mt-1" />
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default AboutSection;