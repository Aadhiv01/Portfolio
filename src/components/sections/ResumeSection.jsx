import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faBriefcase, faGraduationCap, faCode } from '@fortawesome/free-solid-svg-icons';

const ResumeSection = () => {
  const resumeData = {
    experience: [
      {
        title: "Full Stack Developer",
        company: "Innovative Solutions Inc.",
        period: "2020 - Present",
        responsibilities: [
          "Developed and maintained robust web applications using React and Node.js",
          "Implemented CI/CD pipelines, improving deployment efficiency by 40%",
          "Led a team of 5 developers in delivering high-impact projects for Fortune 500 clients"
        ]
      },
      {
        title: "Software Engineer Intern",
        company: "Tech Pioneers Ltd.",
        period: "Summer 2019",
        responsibilities: [
          "Contributed to the development of a machine learning-powered recommendation engine",
          "Optimized database queries, resulting in a 30% improvement in application performance"
        ]
      }
    ],
    education: [
      {
        degree: "Master of Science in Computer Science",
        institution: "Tech University",
        year: "2020"
      },
      {
        degree: "Bachelor of Science in Software Engineering",
        institution: "Engineering College",
        year: "2018"
      }
    ],
    skills: ["React", "Node.js", "Python", "AWS", "Docker", "Machine Learning", "Git", "Agile Methodologies"]
  };

  return (
    <section id="resume" className="section resume">
      <motion.div 
        className="resume-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">Resume</h2>
        <motion.a 
          href="/AADHITHYA_VIJAYAKUMAR_Resume.pdf"
          download
          className="download-resume-btn"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faDownload} /> Download Full Resume
        </motion.a>

        <div className="resume-grid">
          <div className="resume-column">
            <h3><FontAwesomeIcon icon={faBriefcase} /> Experience</h3>
            {resumeData.experience.map((job, index) => (
              <motion.div 
                key={index} 
                className="resume-item"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4>{job.title}</h4>
                <h5>{job.company}</h5>
                <p className="resume-period">{job.period}</p>
                <ul>
                  {job.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="resume-column">
            <h3><FontAwesomeIcon icon={faGraduationCap} /> Education</h3>
            {resumeData.education.map((edu, index) => (
              <motion.div 
                key={index} 
                className="resume-item"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4>{edu.degree}</h4>
                <h5>{edu.institution}</h5>
                <p className="resume-period">{edu.year}</p>
              </motion.div>
            ))}

            <h3><FontAwesomeIcon icon={faCode} /> Skills</h3>
            <motion.div 
              className="skills-container"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {resumeData.skills.map((skill, index) => (
                <motion.span 
                  key={index} 
                  className="skill-tag"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .resume-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 50px 20px;
        }

        .section-title {
          font-size: 2.5rem;
          color: var(--heading-color);
          margin-bottom: 30px;
          text-align: center;
        }

        .download-resume-btn {
          display: inline-block;
          padding: 12px 24px;
          background: var(--accent-color);
          color: var(--primary-color);
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          margin-bottom: 40px;
          transition: all 0.3s ease;
        }

        .download-resume-btn:hover {
          background: var(--button-hover);
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .resume-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .resume-column h3 {
          font-size: 1.5rem;
          color: var(--accent-color);
          margin-bottom: 20px;
        }

        .resume-item {
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .resume-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .resume-item h4 {
          font-size: 1.2rem;
          color: var(--heading-color);
          margin-bottom: 5px;
        }

        .resume-item h5 {
          font-size: 1rem;
          color: var(--text-color);
          margin-bottom: 10px;
        }

        .resume-period {
          font-style: italic;
          color: var(--accent-color);
          margin-bottom: 10px;
        }

        .resume-item ul {
          padding-left: 20px;
        }

        .resume-item li {
          margin-bottom: 5px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .skill-tag {
          padding: 5px 10px;
          background: var(--accent-color);
          color: var(--primary-color);
          border-radius: 15px;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .resume-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ResumeSection;
