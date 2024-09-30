import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
// import SkillChart from './SkillChart';

import Navbar from './Navbar';
import MouseFollowFocus from './MouseFollowFocus';
import My3DModel from './My3DModel';
import styles from './CSS/styles.module.css';
import './CSS/About.css';

function About() {

  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <div className={`${styles.page__style} ${styles.animate_content}`}  style={{ overflowY: !isNavCollapsed ? 'scroll' : 'hidden' }}>
      <div style={{ zIndex: '50' }}><Navbar toggleNav={toggleNav} isNavCollapsed={isNavCollapsed} /></div>
      <MouseFollowFocus />
      <div className="text-left home-container" style={{ overflowY: !isNavCollapsed ? 'scroll' : 'hidden', float: 'left', width: '50%', zIndex: '1' }}>
      <div className="about-page">
            <section className="about-section">
                <h1>About Me</h1>
                <p>
                    Hey there! I’m [Your Name], a software alchemist turning lines of code into digital masterpieces. My playground? The ever-evolving world of tech, where I craft solutions that are as elegant as they are powerful. With a toolkit brimming with [mention key technologies, e.g., JavaScript, Python, React, Node.js], I’ve spent [X] years transforming ideas into experiences that resonate.
                </p>
            </section>
            
            <section className="story-section">
                <h2>My Story</h2>
                <p>
                    Every great journey starts with curiosity, and mine was no different. It all began [a brief, engaging intro, e.g., "with a spark of fascination while dismantling my first computer," or "when I turned a simple 'Hello, World!' into a gateway to endless possibilities"]. Fast forward to today, and that curiosity has grown into a full-blown passion for coding, problem-solving, and creating digital wonders.
                </p>
                <p>
                    I’ve had the privilege to collaborate with [mention types of clients or companies, e.g., forward-thinking startups, global enterprises, or visionary entrepreneurs], pushing the boundaries of what’s possible in the digital realm. Whether it’s breathing life into a web application or engineering a rock-solid backend, I thrive on the challenge of making the complex seem simple.
                </p>
            </section>

            {/* <section className="skills-section">
                <h2>My Skills</h2>
                <SkillChart />
            </section> */}

            <section className="philosophy-section">
                <h2>My Philosophy</h2>
                <p>
                    I believe in more than just writing code—I believe in crafting solutions that are intuitive, impactful, and, above all, human. Agile methodologies keep my workflow dynamic, and a user-first mindset ensures the end product always hits the mark.
                </p>
            </section>

            <section className="3d-section">
                <h2>Explore My World</h2>
                <div style={{ height: '500px' }}>
                    <My3DModel />
                </div>
            </section>

            <section className="contact-section">
                <h2>Let’s Create Something Incredible</h2>
                <p>
                    Got a challenge that needs a fresh perspective? An idea itching to be realized? Let’s connect and turn your vision into something extraordinary. Reach out [mention contact method, e.g., via the contact form, email, or LinkedIn], and let’s start building the future together.
                </p>
            </section>
        </div>
      </div>
    </div>
  )
}

export default About
