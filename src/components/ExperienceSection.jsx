import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendar, faBuilding } from '@fortawesome/free-solid-svg-icons';

const ExperienceItem = ({ company, position, duration, description, skills }) => {
  return (
    <motion.div 
      className="experience-item glass-effect"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 30px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center mb-2">
        <FontAwesomeIcon icon={faBriefcase} className="text-accent mr-2" />
        <h3 className="text-xl font-bold">{position}</h3>
      </div>
      <div className="flex items-center mb-2">
        <FontAwesomeIcon icon={faBuilding} className="text-accent mr-2" />
        <h4 className="text-lg">{company}</h4>
      </div>
      <div className="flex items-center mb-2">
        <FontAwesomeIcon icon={faCalendar} className="text-accent mr-2" />
        <p className="text-sm">{duration}</p>
      </div>
      <p className="mb-4">{description}</p>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const experiences = [
    {
      company: "University of Utah",
      position: "Web Software Developer",
      duration: "Aug 2023 - Present",
      description: `Designed an application to support easy scheduling of class meetings using Java, Spring Boot, Hibernate, React.js, and MySQL, reducing administrative workload by 40%. 
      Analyzed Zoom meeting interactions and related details using C++ web scraping techniques and OAuth 2.0 for secure access. 
      Crafted data visualizations based on data analysis, offering detailed insights. 
      Engineered a Student Field Tracker app with AngularJS, C#, ASP.NET, and MS SQL Server, boosting data retrieval speed by 60%. 
      Collaborated with the cloud team to integrate and deploy using AWS DevOps pipelines, enhancing cloud performance.`,
      skills: ["Java", "Spring Boot", "Hibernate", "React.js", "MySQL", "AWS DevOps", "OAuth 2.0", "AngularJS", "C#", "ASP.NET", "MS SQL Server"]
    },
    {
      company: "Grid Elevated",
      position: "Software Development Intern",
      duration: "Jan 2023 - Aug 2023",
      description: `Deployed Apache Kafka for real-time data streaming, reducing data latency and improving processing. 
      Engineered SSL/TLS encryption standards to safeguard client data, ensuring zero data breaches over 6 months. 
      Migrated 300+ client databases, enhancing data accuracy with object-oriented Python programming. 
      Developed a client-accessible website using React.js, Redux, and JavaScript, leading to a 40% increase in client engagement. 
      Integrated AWS RDS and hosted the codebase on AWS EC2, improving scalability.`,
      skills: ["Apache Kafka", "Python", "SSL/TLS Encryption", "React.js", "Redux", "AWS RDS", "AWS EC2"]
    },
    {
      company: "JPMorgan Chase & Co",
      position: "Software Engineering Consultant",
      duration: "Oct 2021 - Jul 2022",
      description: `Developed secure transaction processing workflows in Java Spring Boot Microservices, improving accuracy by 30%. 
      Enhanced system reliability through TDD practices, reducing production errors using JUnit and Mockito. 
      Streamlined CI/CD pipelines with Jenkins and Kubernetes, minimizing deployment errors. 
      Improved cross-functional team collaboration with automated version control processes. 
      Facilitated agile methodologies for detailed user stories via Jira and Confluence.`,
      skills: ["Java Spring Boot", "Microservices", "JUnit", "Mockito", "CI/CD", "Jenkins", "Kubernetes", "Agile", "Jira", "Confluence"]
    },
    {
      company: "John Wiley & Sons, Inc.",
      position: "Software Developer Intern",
      duration: "May 2021 - Oct 2021",
      description: `Designed user-friendly interfaces with React.js, HTML5, CSS3, JavaScript, and jQuery while developing APIs in Java and Python. 
      Improved data retrieval efficiency by 40% through SQL and NoSQL optimizations. 
      Championed cross-browser compatibility with 18 automated test scenarios, achieving a 90% success rate. 
      Developed an Online Retail Store Application using Spring Boot, React.js, and MySQL.`,
      skills: ["React.js", "HTML5", "CSS3", "JavaScript", "jQuery", "Java", "Python", "SQL", "NoSQL", "Spring Boot", "MySQL"]
    }
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
    <section id="experience" className="section experience">
      <motion.div 
        className="experience-content"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SectionHeader>Professional Journey</SectionHeader>
        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <ExperienceItem key={index} {...exp} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export { ExperienceSection };