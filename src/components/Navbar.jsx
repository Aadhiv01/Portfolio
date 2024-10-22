import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const NavItem = ({ section, onClick, isActive }) => (
  <motion.button 
    onClick={() => onClick(section)}
    className={isActive ? 'active' : ''}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    {section.charAt(0).toUpperCase() + section.slice(1)}
  </motion.button>
);

const Navbar = ({ activeSection, onNavClick, darkMode, toggleDarkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sections = ['home', 'about', 'expertise', 'projects', 'experience', 'certifications', 'inspiration', 'contact'];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavClick = (section) => {
    console.log("Section clicked: ", section);
    onNavClick(section);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`portfolio-nav ${isMobile ? 'mobile' : ''}`}>
      {isMobile ? (
        <>
          <div className="mobile-nav-container">
            <motion.button
              className="hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </motion.button>
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  className="mobile-menu"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {sections.map((section) => (
                    <NavItem
                      key={section}
                      section={section}
                      onClick={handleNavClick}
                      isActive={activeSection === section}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="theme-toggle"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </motion.button>
        </>
      ) : (
        <>
          {sections.map((section) => (
            <NavItem
              key={section}
              section={section}
              onClick={handleNavClick}
              isActive={activeSection === section}
            />
          ))}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="theme-toggle"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </motion.button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
