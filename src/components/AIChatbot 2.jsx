import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getChatbotResponse } from './aiUtils';

const ChatbotMessage = ({ message, type }) => (
  <motion.div
    className={`chatbot-message ${type}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <p>{message}</p>
  </motion.div>
);

const AIChatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatbotMessages]);

  const handleChatbotSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setChatbotMessages(prev => [...prev, { type: 'user', message: userInput }]);
    setUserInput('');
    setIsTyping(true);
    
    const response = await getChatbotResponse(userInput);
    setIsTyping(false);
    setChatbotMessages(prev => [...prev, { type: 'bot', message: response }]);
  };

  return (
    <>
      <motion.div 
        className={`chatbot-toggle ${showChatbot ? 'active' : ''}`}
        onClick={() => setShowChatbot(!showChatbot)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {showChatbot ? <FontAwesomeIcon icon={faTimes} /> : 'Chat'}
      </motion.div>

      <AnimatePresence>
        {showChatbot && (
          <motion.div 
            className="chatbot-container glass-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="chatbot-header">
              <h3>AI Assistant</h3>
              <motion.button
                className="close-button"
                onClick={() => setShowChatbot(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </motion.button>
            </div>
            <div className="chatbot-messages">
              {chatbotMessages.map((msg, index) => (
                <ChatbotMessage key={index} {...msg} />
              ))}
              {isTyping && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="chatbot-form" onSubmit={handleChatbotSubmit}>
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message here..."
              />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .chatbot-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--secondary-color);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .chatbot-container {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 350px;
          height: 500px;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }

        .chatbot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .close-button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 16px;
        }

        .chatbot-messages {
          flex-grow: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .chatbot-message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 10px;
          max-width: 80%;
          word-wrap: break-word;
        }

        .chatbot-message.user {
          background: rgba(255, 255, 255, 0.1);
          margin-left: auto;
        }

        .chatbot-message.bot {
          background: var(--secondary-color);
          margin-right: auto;
        }

        .typing-indicator {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 10px;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #fff;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
          animation: bounce 1.3s linear infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .chatbot-form {
          display: flex;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
        }

        .chatbot-form input {
          flex-grow: 1;
          padding: 10px;
          border: none;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 14px;
        }

        .chatbot-form input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .chatbot-form button {
          background: var(--secondary-color);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          margin-left: 10px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .chatbot-container {
            width: 90%;
            height: 70vh;
            bottom: 80px;
            right: 5%;
            left: 5%;
          }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;