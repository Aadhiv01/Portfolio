import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import LandingSection from "./sections/LandingSection";
import AboutSection from "./sections/AboutSection";
import ExpertiseSection from "./sections/ExpertiseSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectSection from "./sections/ProjectSection";
import CertificationsSection from "./sections/CertificationSection";
import InspirationSection from "./sections/InspirationSection";
import ContactSection from "./sections/ContactSection";

import Navbar from "./Navbar";
import profilePic from "../utilities/Profile_Picture.jpg";
import ResumeButton from "./Resume_Button";
import MouseFollowFocus from "./MouseFollowFocus";

import './CSS/Home.css'

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
        <section
            id="home"
            ref={sectionRefs.home}
            className="section home"
        >
          <LandingSection
            profilePic={profilePic}
            onButtonClick={handleNavClick}
          />
        </section>
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
    </div>
  );
};

export default Home;
