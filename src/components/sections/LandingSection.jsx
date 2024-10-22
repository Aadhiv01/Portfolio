import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const LandingSection = ({ profilePic, onButtonClick }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div className="profile-picture-container" variants={itemVariants}>
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
            "Full-Stack Developer",
            2000,
            "AI Enthusiast",
            2000,
            "Problem Solver",
            2000,
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
        Bridging creativity and technical mastery to craft immersive, end-to-end
        software solutions
      </motion.p>

      <motion.div
        className="flex justify-center space-x-4"
        variants={itemVariants}
      >
        <motion.button
          className="cta-button primary"
          onClick={() => onButtonClick("projects")}
        >
          View Projects
        </motion.button>
        <motion.button
          className="cta-button secondary"
          onClick={() => onButtonClick("contact")}
        >
          Contact Me
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingSection;
