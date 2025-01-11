import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import resume from '../utilities/AADHITHYA_VIJAYAKUMAR_Resume.pdf';

const ResumeButton = () => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
    
        checkMobile();
        window.addEventListener('resize', checkMobile);
    
        return () => window.removeEventListener('resize', checkMobile);
      }, []);

  return (
    <motion.a
      href={resume}
      download="Aadhithya_Vijayakumar_Resume.pdf"
      className="download-resume-button"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FontAwesomeIcon icon={faDownload} className="" />
      {!isMobile ? <>&nbsp;Download Resume</> : <></>}
      <style jsx>{`
        .download-resume-button {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background-color: var(--accent-color);
          color: var(--primary-color);
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: bold;
          text-decoration: none !important;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .download-resume-button:hover {
            color: var(--primary-color);
        }
      `}</style>
    </motion.a>
  );
};

export default ResumeButton;
