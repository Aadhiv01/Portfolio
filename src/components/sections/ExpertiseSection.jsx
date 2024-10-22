import { motion } from 'framer-motion';
import { faChartBar, faCloud, faCodeBranch, faCogs, faDatabase, faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ExpertiseSection = () => {

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

    return (
        <div className="container mx-auto px-4">
            <motion.h2
              className="header"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Areas of Expertise
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
              {[
                {
                  name: "Full-Stack Development",
                  icon: faServer,
                  description:
                    "Mastery in end-to-end application development, from server-side logic to intuitive user interfaces.",
                },
                {
                  name: "Cloud Architecture",
                  icon: faCloud,
                  description:
                    "Designing and implementing scalable, resilient cloud solutions using AWS, GCP, and Azure.",
                },
                {
                  name: "Database Optimization",
                  icon: faDatabase,
                  description:
                    "Expertise in SQL and NoSQL databases, focusing on performance tuning and data modeling.",
                },
                {
                  name: "API Design & Microservices",
                  icon: faCodeBranch,
                  description:
                    "Creating scalable, RESTful APIs and microservices architectures for modular, maintainable systems.",
                },
                {
                  name: "DevOps & CI/CD",
                  icon: faCogs,
                  description:
                    "Implementing robust CI/CD pipelines and DevOps practices for seamless deployment and operation.",
                },
                {
                  name: "Data Engineering & Analytics",
                  icon: faChartBar,
                  description:
                    "Building robust data pipelines, architecting advanced real-time data processing systems, and crafting insightful visualizations",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="expertise-item bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-200 backdrop-filter backdrop-blur-lg"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-5xl mb-4 text-purple-400"
                  />
                  <h3 className="text-xl font-semibold mb-3 text-teal-300">
                    {item.name}
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
    )
}

export default ExpertiseSection
