import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ArrowUpRight, Code, ChevronDown, Star, Award, Zap } from 'lucide-react';
import hours_tracker_pic from "./utilities/hours_tracker.png";
import neighbor_nexus_pic from "./utilities/neighbor_nexus.jpeg";
import quiz_master_pic from "./utilities/quiz_master.avif";

const projectsData = [
  {
    title: "StudentFieldwork Tracker",
    description: "Revolutionizing BCBA student fieldwork hour tracking with AI-powered insights.",
    technologies: ["C#", ".NET", "Angular", "SQL Server", "Azure AI"],
    features: [
      "AI-driven hour prediction and optimization",
      "Blockchain-based verification system",
      "Real-time collaboration tools",
      "Personalized learning pathways"
    ],
    impact: "Reduced administrative workload by 60% and improved student success rates by 35%.",
    demoLink: "/projects/studentfieldwork-tracker",
    codeLink: "https://github.com/yourusername/studentfieldwork-tracker",
    image: hours_tracker_pic
  },
  {
    title: "NeighborNexus",
    description: "Empowering communities through a cutting-edge social platform and marketplace.",
    technologies: ["Node.js", "GraphQL", "MongoDB", "React Native", "AWS"],
    features: [
      "AI-powered service matching algorithm",
      "Augmented reality community mapping",
      "Blockchain-based local currency system",
      "Voice-activated emergency assistance"
    ],
    impact: "Increased community engagement by 120% and facilitated over $1M in local transactions.",
    demoLink: "/projects/neighbornexus",
    codeLink: "https://github.com/yourusername/neighbornexus",
    image: neighbor_nexus_pic
  },
  {
    title: "Quiz Master",
    description: "Next-gen learning platform leveraging AI to create personalized quiz experiences.",
    technologies: ["Python", "Flask", "SQLlite", "React"],
    features: [
      "AI-generated adaptive quizzes",
      "Natural language processing for free-form answers",
      "Real-time knowledge graph visualization",
      "VR/AR immersive quiz environments"
    ],
    impact: "Boosted student engagement by 80% and improved test scores by an average of 40%.",
    demoLink: "/projects/quiz-master-ai",
    codeLink: "https://github.com/yourusername/quiz-master-ai",
    image: quiz_master_pic
  }
];

const ProjectCard = ({ project, isExpanded, toggleExpand, index }) => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    controls.start(isExpanded ? "expanded" : "collapsed");
  }, [isExpanded, controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        delay: index * 0.1 
      } 
    },
    hover: { 
      scale: 1.03, 
      boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }
  };

  const imageVariants = {
    hover: { scale: 1.05, filter: "brightness(1.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <motion.div 
          className="relative overflow-hidden rounded-xl mb-6"
          variants={imageVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-64 object-cover transition-transform duration-300 ease-in-out"
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 transition-opacity duration-300"
            animate={{ opacity: isHovered ? 0.7 : 0 }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
            <p className="text-sm">{project.description}</p>
          </motion.div>
        </motion.div>
        
        <motion.h3 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {project.title}
        </motion.h3>
        <motion.p className="text-gray-300 mb-4 text-lg">{project.description}</motion.p>
        <motion.div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <motion.span
              key={index}
              className="bg-blue-500 bg-opacity-20 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
        <motion.button
          className="w-full text-center text-blue-400 focus:outline-none"
          onClick={toggleExpand}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className={`inline-block transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </motion.button>
        <AnimatePresence>
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate={controls}
            exit="collapsed"
          >
            <motion.h4 className="font-semibold mt-6 mb-3 text-xl flex items-center">
              <Star className="mr-2 text-yellow-400" /> Key Features
            </motion.h4>
            <motion.ul className="space-y-2 mb-6">
              {project.features.map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Zap className="mr-2 text-blue-400 flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.h4 className="font-semibold mb-3 text-xl flex items-center">
              <Award className="mr-2 text-green-400" /> Project Impact
            </motion.h4>
            <motion.p className="mb-6 text-gray-300">{project.impact}</motion.p>
            <motion.div className="flex gap-4">
              <motion.a 
                href={project.demoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUpRight size={20} /> Live Demo
              </motion.a>
              <motion.a 
                href={project.codeLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code size={20} /> View Code
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const IneractiveProjectShowcase = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="px-4 min-h-screen">
      <motion.div
        className="flex flex-col gap-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <AnimatePresence>
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              isExpanded={expandedIndex === index}
              toggleExpand={() => toggleExpand(index)}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default IneractiveProjectShowcase;
