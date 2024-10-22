import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-transparent to-slate-50/30">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-3xl mx-auto"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-4xl font-bold mb-12 text-center"
        >
          About Me
        </motion.h2>

        <motion.div 
          variants={itemVariants}
          className="prose prose-lg max-w-none space-y-8"
        >
          <p className="text-lg leading-relaxed">
            My journey in software development began with a fascination for the evolving digital landscape. Watching the transformation of user experiences across the web ignited my curiosity about the intricate systems powering modern technology. From writing my first lines of code in school to now crafting comprehensive software solutions, each step has been driven by an unwavering desire to understand and create.
          </p>

          <p className="text-lg leading-relaxed">
            As a full-stack developer, I thrive on transforming complex challenges into elegant, user-centric solutions. I believe in building software that not only meets current needs but anticipates future demands. This forward-thinking approach has guided me in creating scalable applications that deliver meaningful impact while maintaining peak performance and security.
          </p>

          <p className="text-lg leading-relaxed">
            Looking ahead, I'm excited to push the boundaries of what's possible by exploring the convergence of software development with data engineering and advanced DevOps practices. This continuous evolution and adaptability reflect my commitment to growth and innovation in an ever-changing technological landscape.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutSection;
