import React from 'react';
import { motion } from 'framer-motion';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBuilding } from '@fortawesome/free-solid-svg-icons';
import uofu_logo from '../../utilities/uofu_logo.png';
import grid_elevated_logo from '../../utilities/grid_elevated_logo.jpeg';
import jpmc_logo from '../../utilities/jpmc_logo.jpeg';
import john_wiley_and_sons_logo from '../../utilities/john_wiley_and_sons_logo.jpeg';

const ExperienceItem = ({ company, position, duration, description, skills, isWork, image }) => {
  const iconStyle = {
    flex: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    height: '4.4vw',
    width: '5vw',
    borderColor: 'teal'
  };

  return (
    <VerticalTimelineElement
      className="vertical-timeline-element--work"
      contentStyle={{ background: 'linear-gradient(to bottom right, #111827, #1f2937)',
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                      color: '#fff' }}
      date={duration}
      dateClassName="text-lg font-semibold text-accent text-white"
      iconStyle={iconStyle}
      icon={<img src={image} alt="myLogo" style={{ borderRadius: '50%', height: '4.4vw', width: '5vw' }} />}
    >
      <h3 className="vertical-timeline-element-title text-xl font-bold"><span><FontAwesomeIcon icon={faBriefcase} className="text-accent mr-2" /></span>{position}</h3>
      <h4 className="vertical-timeline-element-subtitle text-lg mt-2"><span><FontAwesomeIcon icon={faBuilding} className="text-accent mr-2" /></span>{company}</h4>
      <p className="mt-4">{description}</p>
      <div className="skills-container mt-4 flex flex-wrap">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag bg-accent font-semibold px-2 py-1 rounded-full text-sm mr-2 mb-2">
            {skill}
          </span>
        ))}
      </div>
    </VerticalTimelineElement>
  );
};

const ExperienceSection = () => {
  const experiences = [
    {
      company: "University of Utah",
      position: "Web Software Developer",
      duration: "Aug 2023 - Present",
      description: `Designed an application to support easy scheduling of class meetings using Java, Spring Boot, Hibernate, React.js, and MySQL, reducing administrative workload by 40%. 
      Analyzed Zoom meeting interactions and related details using C++ web scraping techniques and OAuth 2.0 for secure access.`,
      skills: ["Java", "Spring Boot", "Hibernate", "React.js", "MySQL", "AWS DevOps", "OAuth 2.0"],
      isWork: true,
      image: uofu_logo
    },
    {
      company: "Grid Elevated",
      position: "Software Development Intern",
      duration: "Jan 2023 - Aug 2023",
      description: `Deployed Apache Kafka for real-time data streaming, reducing data latency and improving processing. 
      Engineered SSL/TLS encryption standards to safeguard client data, ensuring zero data breaches over 6 months.`,
      skills: ["Apache Kafka", "Python", "SSL/TLS Encryption", "React.js", "Redux", "AWS RDS", "AWS EC2"],
      isWork: true,
      image: grid_elevated_logo
    },
    {
      company: "JPMorgan Chase & Co",
      position: "Software Engineering Consultant",
      duration: "Oct 2021 - Jul 2022",
      description: `Developed secure transaction processing workflows in Java Spring Boot Microservices, improving accuracy by 30%. 
      Enhanced system reliability through TDD practices, reducing production errors using JUnit and Mockito.`,
      skills: ["Java Spring Boot", "Microservices", "JUnit", "Mockito", "CI/CD", "Jenkins", "Kubernetes"],
      isWork: true,
      image: jpmc_logo
    },
    {
      company: "John Wiley & Sons, Inc.",
      position: "Software Developer Intern",
      duration: "May 2021 - Oct 2021",
      description: `Designed user-friendly interfaces with React.js, HTML5, CSS3, JavaScript, and jQuery while developing APIs in Java and Python. 
      Improved data retrieval efficiency by 40% through SQL and NoSQL optimizations.`,
      skills: ["React.js", "HTML5", "CSS3", "JavaScript", "jQuery", "Java", "Python", "SQL", "NoSQL"],
      isWork: true,
      image: john_wiley_and_sons_logo
    }
  ];

  return (
    <motion.section 
      id="experience"
      className="section experience py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="container mx-auto px-4"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}    
        >
          EXPERIENCE
        </motion.h2>
        <VerticalTimeline lineColor={'#06D6A0'}>
          {experiences.map((exp, index) => (
            <ExperienceItem key={index} {...exp} />
          ))}
        </VerticalTimeline>
      </motion.div>
    </motion.section>
  );
};

export { ExperienceSection };