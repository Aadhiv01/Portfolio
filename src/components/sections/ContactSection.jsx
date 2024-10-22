import React, { useState } from "react";
import { motion } from "framer-motion";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emailjs from "emailjs-com";

import '../CSS/sectioncss/ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .send(
        "service_ej0f1qq",
        "template_7ib4kef",
        formData,
        "9mhJjKBAbto71FcxV"
      )
      .then((result) => {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setIsSending(false);
      })
      .catch((error) => {
        alert("Failed to send message, please try again later.");
        console.error("EmailJS error:", error);
        setIsSending(false);
      });
  };

  return (
    <>
      <motion.div
        className="contact-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Let's Connect
        </motion.h2>
        <p className="contact-intro">
          I'm always excited to collaborate on innovative projects, exchange
          ideas, or explore new opportunities. Feel free to reach out!
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            {[
              {
                icon: faEnvelope,
                text: "aadhithya.vijayakumar01@gmail.com",
                link: "mailto:aadhithya.vijayakumar01@gmail.com",
              },
              {
                icon: faLinkedin,
                text: "LinkedIn Profile",
                link: "https://linkedin.com/in/aadhithya-vijayakumar-av",
              },
              {
                icon: faGithub,
                text: "GitHub Repositories",
                link: "https://github.com/Aadhiv01",
              },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <FontAwesomeIcon icon={item.icon} className="contact-icon" />
                <span>{item.text}</span>
              </motion.a>
            ))}
          </div>

          <motion.form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <motion.button
              type="submit"
              disabled={isSending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />{" "}
              {isSending ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </>
  );
};

export default ContactSection;