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

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs
      .send(
        "service_ej0f1qq",
        "template_7ib4kef",
        templateParams,
        "9mhJjKBAbto71FcxV"
      )
      .then((result) => {
        alert("Message sent successfully!");
        console.log("Sent message details list : ", templateParams)
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
          I'm actively seeking full-time software engineering roles where I can leverage my expertise 
          in building scalable web applications and solving complex technical challenges. 
          Whether you have a position that matches my profile or would like to discuss potential 
          opportunities, I'd be delighted to connect.
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            <motion.a
              href="mailto:aadhithya.vijayakumar01@gmail.com"
              className="contact-item"
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0, duration: 0.3 }}
            >
              <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
              <span>aadhithya.vijayakumar01@gmail.com</span>
            </motion.a>
            {[
              {
                icon: faLinkedin,
                text: "LinkedIn Profile",
                href: "https://linkedin.com/in/aadhithya-vijayakumar-av",
              },
              {
                icon: faGithub,
                text: "GitHub Repositories",
                href: "https://github.com/Aadhiv01",
              },
            ].map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
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