import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faMoon, faSun, faServer, faDesktop, faCloud, faCodeBranch, faCogs, faDatabase, faCode, faProjectDiagram, faLightbulb, faRocket, faMountain, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import InteractiveTimeline from './InteractiveTimeline';
import profilePic from '../utilities/Profile_Picture.jpg';
import InteractiveProjectShowcase from '../InteractiveProjectShowcase';
import { ExperienceSection } from './ExperienceSection';
import { CertificationsSection } from './CertificationSection';
import MouseFollowFocus from './MouseFollowFocus';
import AIChatbot from './AIChatbot';
import { SectionAnimation } from './SectionAnimation';
import LandingSection from './LandingSection';
import ResumeButton from './Resume_Button';

const Home = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [darkMode, setDarkMode] = useState(true);
    const [isLandingVisible, setIsLandingVisible] = useState(true);
  
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
          const windowHeight = window.innerHeight;
          const refs = [homeRef, aboutRef, expertiseRef, projectsRef, experienceRef, certificationsRef, inspirationRef, contactRef];
          const sectionNames = ['home', 'about', 'expertise', 'projects', 'experience', 'certifications', 'inspiration', 'contact'];
    
          // Check if we're at the top of the page
          if (scrollPosition < windowHeight / 2) {
            setActiveSection('home');
          } else {
            for (let i = refs.length - 1; i >= 0; i--) {
              const ref = refs[i];
              if (ref.current && ref.current.offsetTop <= scrollPosition + windowHeight / 2) {
                setActiveSection(sectionNames[i]);
                break;
              }
            }
          }
    
          setIsLandingVisible(scrollPosition < windowHeight);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);  
  
    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    };

  // Animated navigation item
  const NavItem = ({ section }) => (
    <motion.button 
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
  );

  // Animated section header
  const SectionHeader = ({ children }) => (
    <motion.h2 
      className="gradient-text text-4xl font-bold mb-6"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  );

  // Animated expertise item
  const ExpertiseItem = ({ name, icon, description }) => {
    return (
      <SectionAnimation>
        <div className="expertise-item glass-effect">
          <FontAwesomeIcon icon={icon} className="expertise-icon" />
          <h3>{name}</h3>
          <p>{description}</p>
        </div>
      </SectionAnimation>
    );
  };

  const ContactSection = () => (
    <section id="contact" ref={contactRef} className="section contact">
      <motion.div 
        className="contact-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader>Let's Connect</SectionHeader>
        <p className="contact-intro">I'm always excited to collaborate on innovative projects, exchange ideas, or explore new opportunities. Feel free to reach out!</p>
        
        <div className="contact-grid">
          <div className="contact-info">
            {[
              { icon: faEnvelope, text: "aadhithya.vijayakumar01@gmail.com", link: "mailto:aadhithya.vijayakumar01@gmail.com" },
              { icon: faLinkedin, text: "LinkedIn Profile", link: "https://linkedin.com/in/aadhithya-vijayakumar-av" },
              { icon: faGithub, text: "GitHub Repositories", link: "https://github.com/Aadhiv01" },
            ].map((item, index) => (
              <motion.a 
                key={index}
                href={item.link}
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-item"
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <FontAwesomeIcon icon={item.icon} className="contact-icon" />
                <span>{item.text}</span>
              </motion.a>
            ))}
          </div>
          
          <motion.form 
            className="contact-form"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPaperPlane} /> Send Message
            </motion.button>
          </motion.form>
        </div>
      </motion.div>

      <style jsx>{`
        .contact-content {
          max-width: 1000px;
          width: 100%;
          margin: 0 auto;
          padding: 50px 20px;
        }

        .contact-intro {
          font-size: 1.2rem;
          text-align: center;
          margin-bottom: 40px;
          color: var(--text-color);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-icon {
          font-size: 1.5rem;
          color: var(--accent-color);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          font-size: 1rem;
        }

        .contact-form textarea {
          min-height: 150px;
          resize: vertical;
        }

        .contact-form button {
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          background: var(--accent-color);
          color: var(--primary-color);
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .contact-form button:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
  

  return (
    <div className={`modern-portfolio ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <nav className="portfolio-nav">
        {['home', 'about', 'expertise', 'projects', 'experience', 'certifications', 'inspiration', 'contact'].map((section) => (
          <NavItem key={section} section={section} />
        ))}
        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </motion.button>
      </nav>

      <ResumeButton />

      <motion.div
        className="floating-name"
        initial={{ opacity: 0, x: -50 }}
        animate={{ 
          opacity: isLandingVisible ? 0 : 1, 
          x: isLandingVisible ? -50 : 0,
          y: isLandingVisible ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        Aadhithya Vijayakumar
      </motion.div>


      <main>
      <MouseFollowFocus />
        <LandingSection profilePic={profilePic} />

        <section id="about" ref={aboutRef} className="section about">
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader>About Me</SectionHeader>
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
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="expertise" ref={expertiseRef} className="section expertise">
  <div className="expertise-content">
    <SectionHeader>Areas of Expertise</SectionHeader>
    <div className="expertise-grid">
      <ExpertiseItem 
        name="Backend Development" 
        icon={faServer} 
        description="Expertise in Python, Java, and C# for robust server-side applications." 
      />
      <ExpertiseItem 
        name="Frontend Development" 
        icon={faDesktop} 
        description="Proficient in React.js, Angular, and Vue.js for responsive UIs." 
      />
      <ExpertiseItem 
        name="Database Management" 
        icon={faDatabase} 
        description="Skilled in SQL and NoSQL databases like MySQL, PostgreSQL, and MongoDB." 
      />
      <ExpertiseItem 
        name="Cloud Computing" 
        icon={faCloud} 
        description="Experience with AWS and GCP for scalable cloud solutions." 
      />
      <ExpertiseItem 
        name="Version Control" 
        icon={faCodeBranch} 
        description="Git expert, managing complex workflows and team collaborations." 
      />
      <ExpertiseItem 
        name="DevOps" 
        icon={faCogs} 
        description="Implementing CI/CD pipelines with Jenkins and Kubernetes." 
      />
    </div>
  </div>
</section>

        <section id="projects" ref={projectsRef} className='section projects'>
            <motion.id
                className="projects-content"
            >
                <SectionHeader>Projects</SectionHeader>
                <div>
                    <InteractiveProjectShowcase />
                </div>
            </motion.id>
        </section>

        <section id="experience" ref={experienceRef} className="section experience">
          <ExperienceSection />
        </section>

{/* Certifications Section */}
<section id="certifications" ref={certificationsRef} className="section certifications">
  <CertificationsSection />
</section>

{/* Inspiration Section */}
<section id="inspiration" ref={inspirationRef} className="section inspiration">
  <motion.div 
    className="inspiration-content"
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <SectionHeader>Inspiration & Vision</SectionHeader>
    <div className="inspiration-grid">
      {[
        { icon: faLightbulb, title: "Innovating for Impact", description: "My goal is to create software solutions that not only solve complex problems but also positively impact people's lives. I'm driven by the potential of technology to transform industries and improve society." },
        { icon: faCode, title: "Continuous Learning", description: "The ever-evolving tech landscape inspires me to continuously learn and adapt. I'm passionate about staying at the forefront of emerging technologies and methodologies to deliver cutting-edge solutions." },
        { icon: faProjectDiagram, title: "Bridging AI and Software Engineering", description: "I'm excited about the potential of AI to revolutionize software development. My vision is to create intelligent systems that seamlessly integrate AI capabilities with robust software engineering practices." },
      ].map((item, index) => (
        <motion.div 
          key={index}
          className="inspiration-item glass-effect"
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0,0,0,0.2)" }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          >
            <FontAwesomeIcon icon={item.icon} className="inspiration-icon" />
          </motion.div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
</section>

{/* Contact Section */}
<section id="contact" ref={contactRef} className="section contact">
  <ContactSection />
</section>
      </main>

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

        .floating-name {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          font-size: 2.88vmin;
          font-weight: bold;
          color: var(--accent-color);
          pointer-events: none;
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
          text-decoration: none;
        }

        .cta-button.secondary {
          background: transparent;
          color: var(--accent-color);
          border: 2px solid var(--accent-color);
          text-decoration: none;
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
          transition: transform 0.3s ease;
        }

        .expertise-item:hover .expertise-icon,
        .inspiration-item:hover .inspiration-icon {
          transform: scale(1.1);
        }

        .experience-timeline {
        position: relative;
        padding-left: 30px;
        }

        .experience-timeline::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--accent-color);
        }

        .skill-tag {
        display: inline-block;
        background: var(--accent-color);
        color: var(--primary-color);
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        margin-right: 5px;
        margin-bottom: 5px;
        }

        .certifications-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        }

        .certification-logo {
        width: 80px;
        height: 80px;
        object-fit: contain;
        }

        .glass-effect {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 20px;
        transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
        .experience-timeline {
            padding-left: 20px;
        }

        .certifications-grid {
            grid-template-columns: 1fr;
        }
        }

        .experience-item,
        .certification-item {
          margin-bottom: 30px;
          padding: 30px;
          border-radius: 15px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .experience-item:hover,
        .certification-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          color: var(--text-color);
          text-decoration: none !important;
          transition: all 0.3s ease;
          font-weight: bold;
          overflow: hidden;
          position: relative;
        }

        .contact-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: all 0.5s;
        }

        .contact-item:hover::before {
          left: 100%;
        }

        .contact-item:hover {
          background: var(--accent-color);
          color: var(--primary-color);
          transform: translateY(-2px);
        }

        .contact-item:hover .contact-icon  {
          color: var(--primary-color) !important;
          transform: translateY(-2px);
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
      `}</style>
    </div>
  );
};

export default Home;