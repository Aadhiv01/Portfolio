import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative container mx-auto px-4 py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative max-w-3xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <h2 className="header">About Me</h2>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-8">
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg text-white"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg leading-relaxed">
              My journey in software development began with a fascination for
              the evolving digital world. Watching the transformation of user
              experiences across various platforms, thoroughly fascinated me and
              fueled my curiosity about the intricacy of ideas and implmentation
              powering modern technology. From writing my first lines of code in
              school to now building comprehensive software solutions, each step
              of my journey has been driven by an unwavering desire to innovate
              and reach newer horizons.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg text-white"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg leading-relaxed">
              As a full-stack developer, I thrive on transforming complex
              challenges into impactful, user-centric solutions. I believe in
              building software that not only meets current needs but also
              anticipates future demands. This progessive mindset has played a
              vital role in my career, aiding me in delivering impressive
              products that uphold peak performance whilst ensuring security and
              reliability.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg text-white"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg leading-relaxed">
              My vision extends beyond traditional development boundaries. I'm
              always looking to broaden my horizons and my opennes to learn
              further fuels my perennial drive to excel. Some fields that i'm
              constantly exploring and passionate about understanding their
              convergence with software engineering include artificial
              intelligence, data architecture, and advanced DevOps practices. In
              particular, I have a strong enthusiasm to integrate AI-powered
              solutions into scalable applications, creating more intelligent
              and adaptive systems. By combining modern development principles
              with emerging technologies, I aim to produce solutions that aren't
              just functional, but truly transformative. This unwavering
              commitment to pushing technical boundaries while embracing
              innovative technologies defines my approach to professional growth
              and continuous evolution in the ever-advancing tech landscape.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutSection;
