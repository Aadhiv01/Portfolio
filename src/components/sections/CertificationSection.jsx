import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faCalendar,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

import aws_logo from "../../utilities/aws_logo.png";
import oracle_logo from "../../utilities/Oracle_Logo.png";

const CertificationItem = ({ name, issuer, year, logo }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0,0,0,0.2)" }}
    >
      <img src={logo} alt={issuer} className="certification-logo mb-4" />
      <div className="flex items-center mb-2">
        <FontAwesomeIcon icon={faCertificate} className="text-accent mr-2" />
        <h3 className="text-lg font-bold">{name}</h3>
      </div>
      <div className="flex items-center mb-2">
        <FontAwesomeIcon icon={faGraduationCap} className="text-accent mr-2" />
        <p>{issuer}</p>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faCalendar} className="text-accent mr-2" />
        <p>{year}</p>
      </div>
    </motion.div>
  );
};

const CertificationsSection = () => {
  const certifications = [
    {
      name: "AWS Certified Solutions Architect Associate",
      issuer: "Amazon Web Services",
      year: 2023,
      logo: aws_logo,
    },
    {
      name: "Oracle Certified Java Associate",
      issuer: "Oracle",
      year: 2021,
      logo: oracle_logo,
    },
  ];

  const SectionHeader = ({ children }) => (
    <motion.h2
      className="header"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  );

  return (
    <motion.div
      className="certifications-content"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader>Professional Certifications</SectionHeader>
      <div className="certifications-grid">
        {certifications.map((cert, index) => (
          <CertificationItem key={index} {...cert} />
        ))}
      </div>
    </motion.div>
  );
};

export default CertificationsSection;
