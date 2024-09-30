import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const LandingSection = ({ profilePic }) => {
    const controls = useAnimation();
    const homeRef = useRef(null);
    const isInView = useInView(homeRef, { once: true });
  
    useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [isInView, controls]);
  
    const containerVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          delay: 0.2,
          staggerChildren: 0.1
        }
      }
    };
  
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
      }
    };
  
    return (
      <motion.section
        id="home"
        ref={homeRef}
        className="section home"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="profile-picture-container"
            variants={itemVariants}
          >
            <img
              src={profilePic}
              alt="Aadhithya Vijayakumar"
              className="profile-picture"
            />
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </motion.div>
          
          <motion.h1
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            variants={itemVariants}
          >
            Aadhithya Vijayakumar
          </motion.h1>
          
          <motion.div
            className="text-2xl font-semibold mb-6 h-12"
            variants={itemVariants}
          >
            <TypeAnimation
              sequence={[
                'Full-Stack Developer',
                2000,
                'AI Enthusiast',
                2000,
                'Problem Solver',
                2000
              ]}
              wrapper="div"
              cursor={true}
              repeat={Infinity}
            />
          </motion.div>
          
          <motion.p
            className="text-xl mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Crafting innovative solutions at the intersection of AI and robust software engineering
          </motion.p>
          
          <motion.div className="flex justify-center space-x-4" variants={itemVariants}>
            <a
              href="#projects"
              className="cta-button primary"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="cta-button secondary"
            >
              Contact Me
            </a>
          </motion.div>
        </div>
      </motion.section>
    );
  };
  
  export default LandingSection;