import React from 'react';
import { motion } from 'framer-motion';

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
        className="text-lg leading-relaxed"
        variants={fadeInUpVariants}
      >
        I specialize in crafting seamless experiences from front-end to back-end, leveraging cutting-edge technologies to build scalable, robust applications that make a real impact. My expertise spans modern web frameworks, cloud computing, and AI integration, allowing me to create comprehensive solutions that push the boundaries of what's possible.
      </motion.p>
    </motion.div>
  );
}

export default AboutSection;