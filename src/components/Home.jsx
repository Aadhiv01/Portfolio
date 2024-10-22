import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import LandingSection from "./sections/LandingSection";
import AboutSection from "./sections/AboutSection";
import ExpertiseSection from "./sections/ExpertiseSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import ProjectSection from "./sections/ProjectSection";
import { CertificationsSection } from "./sections/CertificationSection";
import InspirationSection from "./sections/InspirationSection";
import ContactSection from "./sections/ContactSection";

import Navbar from "./Navbar";
import profilePic from "../utilities/Profile_Picture.jpg";
import ResumeButton from "./Resume_Button";
import MouseFollowFocus from "./MouseFollowFocus";

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [isLandingVisible, setIsLandingVisible] = useState(true);

  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    expertise: useRef(null),
    projects: useRef(null),
    experience: useRef(null),
    certifications: useRef(null),
    inspiration: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const refs = [
        sectionRefs.home,
        sectionRefs.about,
        sectionRefs.expertise,
        sectionRefs.projects,
        sectionRefs.experience,
        sectionRefs.certifications,
        sectionRefs.inspiration,
        sectionRefs.contact,
      ];
      const sectionNames = [
        "home",
        "about",
        "expertise",
        "projects",
        "experience",
        "certifications",
        "inspiration",
        "contact",
      ];

      if (scrollPosition < windowHeight / 2) {
        setActiveSection("home");
      } else {
        for (let i = refs.length - 1; i >= 0; i--) {
          const ref = refs[i];
          if (
            ref.current &&
            ref.current.offsetTop <= scrollPosition + windowHeight / 2
          ) {
            setActiveSection(sectionNames[i]);
            break;
          }
        }
      }

      setIsLandingVisible(scrollPosition < windowHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavClick = (section) => {
    console.log("Nav button click section in home: ", section);
    setActiveSection(section);
    sectionRefs[section].current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`modern-portfolio ${darkMode ? "dark-mode" : "light-mode"}`}
    >
      <Navbar
        activeSection={activeSection}
        onNavClick={handleNavClick}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <ResumeButton />

      <motion.div
        className="floating-name"
        initial={{ opacity: 0, x: -50 }}
        animate={{
          opacity: isLandingVisible ? 0 : 1,
          x: isLandingVisible ? -50 : 0,
          y: isLandingVisible ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
      >
        Aadhithya Vijayakumar
      </motion.div>

      <main>
        <MouseFollowFocus />
        <LandingSection profilePic={profilePic} onButtonClick={handleNavClick} />

        <section
          id="about"
          ref={sectionRefs.about}
          className="section about"
        >
            <AboutSection />
        </section>

        <section
          id="expertise"
          ref={sectionRefs.expertise}
          className="section expertise"
        >
          <ExpertiseSection />
        </section>

        <section
          id="projects"
          ref={sectionRefs.projects}
          className="section projects mt-60"
        >
            <ProjectSection />
        </section>

        <section
          id="experience"
          ref={sectionRefs.experience}
          className="section experience mt-60"
        >
          <ExperienceSection />
        </section>

        <section
          id="certifications"
          ref={sectionRefs.certifications}
          className="section certifications"
        >
          <CertificationsSection />
        </section>

        <section
          id="inspiration"
          ref={sectionRefs.inspiration}
          className="section inspiration mt-32"
        >
            <InspirationSection />
        </section>

        <section
          id="contact"
          ref={sectionRefs.contact}
          className="section contact mt-60"
        >
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
          --primary-color: #0a192f;
          --secondary-color: #112240;
          --text-color: #ffffff;
          --heading-color: #ccd6f6;
          --accent-color: #64ffda;
          --button-bg: #1e3a8a;
          --button-hover: #2563eb;
          --background-color: #0a192f;
          background: linear-gradient(
            135deg,
            var(--primary-color) 0%,
            var(--secondary-color) 100%
          );
        }

        .modern-portfolio.light-mode {
          --primary-color: #f0f0f0;
          --secondary-color: #e0e0e0;
          --text-color: #333333;
          --heading-color: #1e3a8a;
          --accent-color: #3b82f6;
          --button-bg: #2563eb;
          --button-hover: #1d4ed8;
          --background-color: #ffffff;
          background: linear-gradient(
            135deg,
            var(--primary-color) 0%,
            var(--secondary-color) 100%
          );
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

        .portfolio-nav.mobile {
          left: 20px;
          right: auto;
          transform: none;
          padding: 10px;
          border-radius: 10px;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: calc(100% - 40px);
          max-width: 400px;
        }

        .mobile-nav-container {
          position: relative;
        }

        .portfolio-nav.mobile .hamburger {
          font-size: 24px;
          padding: 8px;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--primary-color);
          border-radius: 10px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 200px;
        }

        .theme-toggle {
          margin-left: auto;
        }

        @media (max-width: 768px) {
          .portfolio-nav {
            flex-direction: row;
            align-items: center;
          }

          .theme-toggle {
            position: static;
            margin-left: 0;
          }
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
        }

        .title-main {
          font-size: 2.5rem;
          color: var(--accent-color);
        }

        .header {
          margin: 0;
          padding-bottom: 4rem;
          color: #4db1bc;
          grid-column: 1;
          grid-row: 1;
          font-weight: 600;
          z-index: 1;
          font-size: 6vmin;
          text-transform: uppercase;
          animation: glow 2s ease-in-out infinite alternate;
          text-align: center;
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 20px #2d9da9;
          }
          to {
            text-shadow: 0 0 30px #34b3c1, 0 0 10px #4dbbc7;
          }
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
          content: "";
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
          content: "";
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

        .contact-item:hover .contact-icon {
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
