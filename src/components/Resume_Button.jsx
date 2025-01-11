import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

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

      const handleDownload = async () => {
        try {
          // Import the PDF file dynamically
          const response = await import('../utilities/AADHITHYA_VIJAYAKUMAR_Resume.pdf');
          
          // Create a link element
          const link = document.createElement('a');
          link.href = response.default;
          link.download = 'AADHITHYA_VIJAYAKUMAR_Resume.pdf';
          
          // Append to document, click, and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading resume:', error);
        }
      };

  return (
    <motion.a
      onClick={handleDownload}
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
          cursor: pointer;
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
