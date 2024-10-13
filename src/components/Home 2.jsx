import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faMoon, faSun, faServer, faDesktop, faCloud, faCodeBranch, faCogs, faDownload, faCertificate, faDatabase, faCode, faProjectDiagram, faLightbulb, faRocket, faMountain } from '@fortawesome/free-solid-svg-icons';
import ProfilePicture from '../utilities/Profile_Picture.jpg';
import AIChatbot from './AIChatbot';
import { useInView } from 'react-intersection-observer';
import InteractiveProjectShowcase from '../InteractiveProjectShowcase';
import MouseFollowFocus from './MouseFollowFocus';

const ExpertiseItem = ({ name, icon, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div 
      ref={ref}
      className="expertise-item glass-effect"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <FontAwesomeIcon icon={icon} className="expertise-icon" />
      <h3>{name}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(true);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const expertiseRef = useRef(null);
  const projectsRef = useRef(null);
  const experienceRef = useRef(null);
  const certificationsRef = useRef(null);
  const contactRef = useRef(null);
  const inspirationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const refs = [homeRef, aboutRef, expertiseRef, projectsRef, experienceRef, certificationsRef, inspirationRef, contactRef];
      const sectionNames = ['home', 'about', 'expertise', 'projects', 'experience', 'certifications', 'inspiration', 'contact'];

      for (let i = 0; i < refs.length; i++) {
        const ref = refs[i];
        if (ref.current && ref.current.offsetTop <= scrollPosition + 300) {
          setActiveSection(sectionNames[i]);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const expertiseData = [
    { name: 'Backend Development', icon: faServer, description: 'Expertise in Python, Java, and C# for robust server-side applications.' },
    { name: 'Frontend Development', icon: faDesktop, description: 'Proficient in React.js, Angular, and Vue.js for responsive UIs.' },
    { name: 'Database Management', icon: faDatabase, description: 'Skilled in SQL and NoSQL databases like MySQL, PostgreSQL, and MongoDB.' },
    { name: 'Cloud Computing', icon: faCloud, description: 'Experience with AWS and GCP for scalable cloud solutions.' },
    { name: 'Version Control', icon: faCodeBranch, description: 'Git expert, managing complex workflows and team collaborations.' },
    { name: 'DevOps', icon: faCogs, description: 'Implementing CI/CD pipelines with Jenkins and Kubernetes.' },
  ];

  const experienceData = [
    {
      company: "University of Utah",
      position: "Web Software Developer",
      duration: "Aug 2023 - Present",
      description: "Led development of advanced scheduling system, reducing administrative workload by 40%. Engineered robust API connections and crafted intuitive data visualizations."
    },
    {
      company: "Grid Elevated",
      position: "Software Development Intern",
      duration: "Jan 2023 - Aug 2023",
      description: "Implemented real-time data streaming with Apache Kafka. Developed innovative encryption solutions, ensuring zero data breaches over a 6-month period."
    },
    {
      company: "JPMorgan Chase & Co",
      position: "Software Engineering Consultant",
      duration: "Oct 2021 - Jul 2022",
      description: "Optimized secure transaction processing workflows, enhancing accuracy by 30%. Implemented TDD practices, significantly reducing production errors."
    },
    {
      company: "John Wiley & Sons, Inc.",
      position: "Software Developer Intern",
      duration: "May 2021 - Oct 2021",
      description: "Optimized secure transaction processing workflows, enhancing accuracy by 30%. Implemented TDD practices, significantly reducing production errors."
    },
  ];

  const certificationsData = [
    { name: "AWS Certified Solutions Architect Associate", issuer: "Amazon Web Services", year: 2023 },
    { name: "Oracle Certified Java Associate", issuer: "Oracle", year: 2021 },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`modern-portfolio ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <nav className="portfolio-nav">
        {['home', 'about', 'expertise', 'projects', 'experience', 'certifications', 'inspiration', 'contact'].map((section) => (
          <motion.button 
            key={section}
            onClick={() => {
              setActiveSection(section);
              document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
            }}
            className={activeSection === section ? 'active' : ''}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </motion.button>
        ))}
        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </motion.button>
      </nav>
      <MouseFollowFocus />
      <main>
        <motion.section 
          id="home" 
          ref={homeRef} 
          className="section home"
          style={{ opacity, scale }}
        >
          <motion.div 
            className="home-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="profile-picture-container"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img src={ProfilePicture} alt="Aadhithya Vijayakumar" className="profile-picture" />
            </motion.div>
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Aadhithya Vijayakumar
            </motion.h1>
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="title-main"
            >
              Full-Stack Developer & AI Enthusiast
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="tagline"
            >
              Crafting innovative solutions at the intersection of AI and robust software engineering
            </motion.p>
            <motion.div 
              className="cta-buttons"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <a href="#projects" className="cta-button primary">View Projects</a>
              <a href="#contact" className="cta-button secondary">Contact Me</a>
            </motion.div>
          </motion.div>
        </motion.section>

        <section id="about" ref={aboutRef} className="section about">
        <motion.div 
      className="about-content"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="gradient-text text-4xl font-bold mb-6">About Me</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="about-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="mb-4 text-lg">
            As a passionate full-stack developer with over 3 years of experience, I thrive on turning complex problems into elegant, efficient solutions. My journey in tech is driven by an insatiable curiosity and a desire to push the boundaries of what's possible.
          </p>
          <p className="mb-4 text-lg">
            From crafting intuitive user interfaces to architecting robust backend systems, I bring a holistic approach to every project. My expertise spans across modern web technologies, cloud computing, and AI integration, allowing me to create comprehensive, scalable solutions that make a real impact.
          </p>
        </motion.div>
        <motion.div 
          className="about-highlights"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-4">What Drives Me</h3>
          <ul className="space-y-4">
            {[
              { icon: faCode, text: "Crafting clean, efficient code that solves real-world problems" },
              { icon: faLightbulb, text: "Continuous learning and staying ahead of tech trends" },
              { icon: faRocket, text: "Pushing the boundaries of what's possible with technology" },
              { icon: faMountain, text: "Tackling complex challenges and turning them into opportunities" }
            ].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              >
                <FontAwesomeIcon icon={item.icon} className="text-blue-400 text-xl" />
                <span>&nbsp;{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
        </section>

        <section id="expertise" ref={expertiseRef} className="section expertise">
          <motion.div 
            className="expertise-content"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="gradient-text">Areas of Expertise</h2>
            <div className="expertise-grid">
              {expertiseData.map((item, index) => (
                <ExpertiseItem key={index} name={item.name} icon={item.icon} description={item.description} />
              ))}
            </div>
          </motion.div>
        </section>

        <section id="projects" ref={projectsRef} className="section projects">
          <motion.div 
            className="projects-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="gradient-text">Featured Projects</h2>
            <InteractiveProjectShowcase />
          </motion.div>
        </section>

        <section id="experience" ref={experienceRef} className="section experience">
          <motion.div 
            className="experience-content"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="gradient-text">Professional Experience</h2>
            {experienceData.map((exp, index) => (
              <motion.div 
                key={index}
                className="experience-item glass-effect"
                whileHover={{ scale: 1.05 }}
              >
                <h3>{exp.position}</h3>
                <h4>{exp.company}</h4>
                <p className="duration">{exp.duration}</p>
                <p>{exp.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="certifications" ref={certificationsRef} className="section certifications">
          <motion.div 
            className="certifications-content"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="gradient-text">Certifications</h2>
            <div className="certifications-grid">
              {certificationsData.map((cert, index) => (
                <motion.div 
                  key={index}
                  className="certification-item glass-effect"
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon icon={faCertificate} className="certification-icon" />
                  <h3>{cert.name}</h3>
                  <p>{cert.issuer}</p>
                  <p>{cert.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="inspiration" ref={inspirationRef} className="section inspiration">
          <motion.div 
            className="inspiration-content"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="gradient-text">Inspiration & Vision</h2>
            <div className="inspiration-grid">
              <motion.div className="inspiration-item glass-effect" whileHover={{ scale: 1.05 }}>
                <FontAwesomeIcon icon={faLightbulb} className="inspiration-icon" />
                <h3>Innovating for Impact</h3>
                <p>My goal is to create software solutions that not only solve complex problems but also positively impact people's lives. I'm driven by the potential of technology to transform industries and improve society.</p>
              </motion.div>
              <motion.div className="inspiration-item glass-effect" whileHover={{ scale: 1.05 }}>
                <FontAwesomeIcon icon={faCode} className="inspiration-icon" />
                <h3>Continuous Learning</h3>
                <p>The ever-evolving tech landscape inspires me to continuously learn and adapt. I'm passionate about staying at the forefront of emerging technologies and methodologies to deliver cutting-edge solutions.</p>
              </motion.div>
              <motion.div className="inspiration-item glass-effect" whileHover={{ scale: 1.05 }}>
                <FontAwesomeIcon icon={faProjectDiagram} className="inspiration-icon" />
                <h3>Bridging AI and Software Engineering</h3>
                <p>I'm excited about the potential of AI to revolutionize software development. My vision is to create intelligent systems that seamlessly integrate AI capabilities with robust software engineering practices.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="contact" ref={contactRef} className="section contact">
          <motion.div 
            className="contact-content"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="gradient-text">Get in Touch</h2>
            <p className="contact-intro">I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
            <div className="contact-info">
              <motion.a 
                href="mailto:aadhithya.vijayakumar01@gmail.com" 
                className="contact-item"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faEnvelope} /> Email Me
              </motion.a>
              <motion.a 
                href="https://linkedin.com/in/aadhithya-vijayakumar-av" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-item"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faLinkedin} /> Connect on LinkedIn
              </motion.a>
              <motion.a 
                href="https://github.com/Aadhiv01" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-item"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faGithub} /> Check my GitHub
              </motion.a>
            </div>
          </motion.div>
        </section>
        <motion.a 
      href="../utilities/AADHITHYA_VIJAYAKUMAR_Resume.pdf"
      download
      className="download-resume"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <FontAwesomeIcon icon={faDownload} /> Download Resume
    </motion.a>
      </main>

      <AIChatbot />

      <style jsx>{`

        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        .modern-portfolio {
          color: var(--text-color);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          transition: background-color 0.3s ease;
        }

        .modern-portfolio.dark-mode {
          --primary-color: #0A192F;
          --secondary-color: #112240;
          --text-color: #FFFFFF;
          --heading-color: #CCD6F6;
          --accent-color: #64FFDA;
          --button-bg: #1E3A8A;
          --button-hover: #2563EB;
          --background-color: #0A192F;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .modern-portfolio.light-mode {
          --primary-color: #f0f0f0;
          --secondary-color: #e0e0e0;
          --text-color: #333333;
          --heading-color: #1E3A8A;
          --accent-color: #3B82F6;
          --button-bg: #2563EB;
          --button-hover: #1D4ED8;
          --background-color: #ffffff;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .portfolio-nav {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          display: flex;
          gap: 15px;
          backdrop-filter: blur(10px);
          padding: 10px 20px;
          border-radius: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .portfolio-nav button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: var(--text-color);
          cursor: pointer;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .portfolio-nav button:hover,
        .portfolio-nav button.active {
          background: var(--accent-color);
          color: var(--primary-color);
          transform: translateY(-2px);
        }

        .section {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 100px 50px;
          scroll-snap-align: start;
        }

        .home-content {
          text-align: center;
          max-width: 800px;
        }

        .profile-picture-container {
          width: 200px;
          height: 200px;
          margin: 0 auto 30px;
          position: relative;
          overflow: hidden;
          border-radius: 50%;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .profile-picture {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .profile-picture-container:hover .profile-picture {
          transform: scale(1.1);
        }

        .home-content h1 {
          font-size: 3.5rem;
          color: var(--heading-color);
          margin-bottom: 10px;
        }

        .title-main {
          font-size: 2.5rem;
          color: var(--accent-color);
          margin-bottom: 20px;
        }

        .tagline {
          font-size: 1.2rem;
          color: var(--text-color);
          max-width: 600px;
          margin: 0 auto 30px;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .cta-button {
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .cta-button.primary {
          background: var(--accent-color);
          color: var(--primary-color);
        }

        .cta-button.secondary {
          background: transparent;
          color: var(--accent-color);
          border: 2px solid var(--accent-color);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .about-content,
        .expertise-content,
        .projects-content,
        .experience-content,
        .certifications-content,
        .inspiration-content,
        .contact-content {
          max-width: 1000px;
          width: 100%;
        }

        .about-text {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .tech-stack {
          margin-top: 30px;
        }

        .tech-icons {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
        }

        .tech-icons svg {
          font-size: 2rem;
          color: var(--accent-color);
        }

        .education {
          margin-top: 30px;
        }

        .degree {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .degree:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .expertise-grid,
        .inspiration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .expertise-item,
        .inspiration-item {
          padding: 30px;
          border-radius: 15px;
          transition: all 0.3s ease;
          text-align: center;
          height: 100%;
        }

        .expertise-icon,
        .inspiration-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          color: var(--accent-color);
        }

        .experience-item,
        .certification-item {
          margin-bottom: 30px;
          padding: 30px;
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .experience-item h3,
        .certification-item h3 {
          color: var(--accent-color);
          margin-bottom: 10px;
        }

        .experience-item h4 {
          color: var(--heading-color);
          margin-bottom: 5px;
        }

        .experience-item .duration {
          font-style: italic;
          margin-bottom: 10px;
        }

        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .certification-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          color: var(--accent-color);
        }

        .contact-intro {
          text-align: center;
          margin-bottom: 30px;
          font-size: 1.2rem;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 30px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          color: var(--text-color);
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: bold;
        }

        .contact-item:hover {
          background: var(--accent-color);
          color: var(--primary-color);
          transform: translateY(-2px);
        }

        .gradient-text {
          font-size: 2.5rem;
          margin-bottom: 30px;
          background: linear-gradient(45deg, var(--heading-color), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-align: center;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .download-resume {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 15px 25px;
          background: var(--accent-color);
          color: var(--primary-color);
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .download-resume:hover {
          background: var(--button-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .portfolio-nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .home-content h1 {
            font-size: 2.5rem;
          }

          .title-main {
            font-size: 1.8rem;
          }

          .tagline {
            font-size: 1rem;
          }

          .section {
          }

          .expertise-grid,
          .certifications-grid,
          .inspiration-grid {
            grid-template-columns: 1fr;
          }

          .contact-info {
            flex-direction: column;
          }

          .download-resume {
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .pulse-element {
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: var(--background-color);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--secondary-color);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--primary-color);
        }
      `}</style>
    </div>
  );
};

export default Home;
