import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Laptop, Server } from "lucide-react";

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
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/5 via-transparent to-slate-100/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />

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
            className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg leading-relaxed text-gray-800">
              My journey in software development began with a fascination for
              the evolving digital landscape. Watching the transformation of
              user experiences across the web ignited my curiosity about the
              intricate systems powering modern technology. From writing my
              first lines of code in school to now crafting comprehensive
              software solutions, each step has been driven by an unwavering
              desire to understand and create.
            </p>
          </motion.div>

          <motion.div
            className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg leading-relaxed text-gray-800">
              As a full-stack developer, I thrive on transforming complex
              challenges into elegant, user-centric solutions. I believe in
              building software that not only meets current needs but
              anticipates future demands. This forward-thinking approach has
              guided me in creating scalable applications that deliver
              meaningful impact while maintaining peak performance and security.
            </p>
          </motion.div>

          <motion.div
            className="relative p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-lg leading-relaxed text-gray-800">
              My vision extends beyond traditional development boundaries. I'm
              actively exploring the synergies between software engineering,
              data architecture, and cloud infrastructure. By integrating
              advanced DevOps practices with modern development principles, I
              aim to architect solutions that aren't just functional, but
              transformative. This commitment to pushing technical boundaries
              while maintaining a strong foundation in software craftsmanship
              defines my approach to professional growth and innovation.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutSection;