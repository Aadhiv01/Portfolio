// import React from "react";
// import { motion } from "framer-motion";

// const AboutSection = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.3,
//         delayChildren: 0.2
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { 
//       opacity: 0, 
//       y: 40,
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut"
//       },
//     },
//   };

//   return (
//     <div className="section about-content">
//       <div className="w-full max-w-4xl mx-auto px-4">
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={containerVariants}
//           className="space-y-8"
//         >
//         <motion.div
//           variants={itemVariants}
//           className="flex items-center justify-center gap-3 mb-16"
//         >
//           <h2 className="header">About Me</h2>
//         </motion.div>
//           <motion.div 
//             variants={itemVariants}
//             className="about-text"
//           >
//             <p className="text-lg text-gray-300 leading-relaxed mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-accent-color">
//             My journey in software development began with a fascination for
//               the evolving digital world. Watching the transformation of user
//               experiences across various platforms, thoroughly fascinated me and
//               fueled my curiosity about the intricacy of ideas and implmentation
//               powering modern technology. From writing my first lines of code in
//               school to now building comprehensive software solutions, each step
//               of my journey has been driven by an unwavering desire to innovate
//               and reach newer horizons.
//             </p>
//           </motion.div>

//           <motion.div 
//             variants={itemVariants}
//             className="about-text"
//           >
//             <p className="text-lg text-gray-300 leading-relaxed mb-6 relative after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-accent-color">
//               As a full-stack developer, I thrive on transforming complex
//               challenges into impactful, user-centric solutions. I believe in
//               building software that not only meets current needs but also
//               anticipates future demands. This progessive mindset has played a
//               vital role in my career, aiding me in delivering impressive
//               products that uphold peak performance whilst ensuring security and
//               reliability.
//             </p>
//           </motion.div>

//           <motion.div 
//             variants={itemVariants}
//             className="about-text"
//           >
//             <p className="text-lg text-gray-300 leading-relaxed relative after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-accent-color">
//               My vision extends beyond conventional boundaries. I'm passionately 
//               exploring the convergence of artificial intelligence, advanced data 
//               architectures, and cutting-edge DevOps practices. My goal is to 
//               develop intelligent, scalable applications that redefine technological 
//               possibilities and push the boundaries of innovation.
//             </p>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AboutSection;


// Implementation 1: Grid Layout with Animated Cards
import React from "react";
import { motion } from "framer-motion";
import { Book, Cpu, Code, Zap } from "lucide-react";

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const iconFeatures = [
    {
      icon: <Book className="w-6 h-6" />,
      text: "Continuous Learning"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      text: "Technical Innovation"
    },
    {
      icon: <Code className="w-6 h-6" />,
      text: "Clean Code"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      text: "Fast Delivery"
    }
  ];

  return (
    <div className="section about-content">
      <div className="w-full max-w-4xl mx-auto px-4 mt-40 mb-40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center -mb-8">
            <h2 className="header">About Me</h2>
          </motion.div>

          {/* Icon Features */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {iconFeatures.map((feature, index) => (
              <div 
                key={index}
                className="glass-effect p-4 rounded-lg text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-accent-color mb-3">
                  {feature.icon}
                </div>
                <p className="text-sm text-gray-300">{feature.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="glass-effect p-6 rounded-xl hover:shadow-xl transition-all duration-300">
              <p className="text-lg text-gray-300 leading-relaxed">
                My journey in software development began with a fascination for
                the evolving digital world. Watching the transformation of user
                experiences across various platforms, thoroughly fascinated me and
                fueled my curiosity about the intricacy of ideas and implementation
                powering modern technology.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl hover:shadow-xl transition-all duration-300">
              <p className="text-lg text-gray-300 leading-relaxed">
                As a full-stack developer, I thrive on transforming complex
                challenges into impactful, user-centric solutions. I believe in
                building software that not only meets current needs but also
                anticipates future demands.
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl hover:shadow-xl transition-all duration-300">
              <p className="text-lg text-gray-300 leading-relaxed">
                My vision extends beyond conventional boundaries. I'm passionately 
                exploring the convergence of artificial intelligence, advanced data 
                architectures, and cutting-edge DevOps practices.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export { AboutSection };