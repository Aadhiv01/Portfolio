import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';

const colors = {
  primary: '#0A192F',
  secondary: '#112240',
  accent: '#64FFDA',
  text: '#CCD6F6',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.accent,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.primary,
      paper: colors.secondary,
    },
    text: {
      primary: colors.text,
      secondary: colors.accent,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: colors.primary,
          backgroundColor: colors.accent,
          '&:hover': {
            backgroundColor: colors.accent + 'CC',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.accent,
            },
            '&:hover fieldset': {
              borderColor: colors.accent,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.accent,
            },
          },
        },
      },
    },
  },
});

const personalInfo = {
  name: "Aadhithya Vijayakumar",
  role: "Full-Stack Developer & Software Engineering Consultant",
  skills: [
    "Python", "Java", "C#", "C++", "JavaScript", "TypeScript", "React.js", "Angular", 
    "Node.js", "Spring Boot", ".NET", "AWS", "GCP", "MySQL", "MongoDB", "PostgreSQL"
  ],
  experience: [
    {
      title: "Web Software Developer",
      company: "University of Utah",
      period: "Aug 2023 - Present",
      description: "Developed applications using Java, Spring Boot, React.js, and MySQL. Implemented API connections and data visualizations."
    },
    {
      title: "Software Development Intern",
      company: "Grid Elevated",
      period: "Jan 2023 - Aug 2023",
      description: "Worked on data streaming with Apache Kafka, implemented encryption standards, and created data processing solutions using Python and React.js."
    },
    {
      title: "Software Engineering Consultant",
      company: "JPMorgan Chase & Co",
      period: "Oct 2021 - Jul 2022",
      description: "Developed secure transaction processing workflows using Java Spring Boot Microservices and implemented CI/CD processes with Jenkins and Kubernetes."
    }
  ],
  education: [
    { degree: "Master of Science in Information Systems", school: "University of Utah", year: "2023" },
    { degree: "Bachelor of Engineering in Electronics and Communication", school: "Anna University", year: "2021" }
  ],
  projects: [
    { name: "Quiz Master Application", description: "Developed using Python and SQL, allowing students to select and complete quizzes with automated percentage calculation." },
    { name: "Online Retail Store Application", description: "Architected using Spring Boot, React.js, and REST APIs with optimized MySQL queries." }
  ],
  certifications: [
    "AWS Certified Solutions Architect Associate",
    "Oracle Certified Java Associate"
  ],
  contact: {
    email: "aadhithya.vijayakumar01@gmail.com",
    linkedin: "linkedin.com/in/aadhithya-vijayakumar-av",
    github: "github.com/Aadhiv01",
    phone: "(385)-456-7908"
  }
};

const predefinedQuestions = [
  "Tell me about Aadhithya's background",
  "What are Aadhithya's key skills?",
  "Can you describe Aadhithya's work experience?",
  "What projects has Aadhithya worked on?",
  "What is Aadhithya's educational background?",
  "What certifications does Aadhithya have?",
  "How can I contact Aadhithya?",
];

const getAIResponse = (input) => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes("background") || lowerInput.includes("about")) {
    return `${personalInfo.name} is a ${personalInfo.role} with experience in full-stack development and software engineering consulting. He has worked with various technologies and has a strong educational background in Information Systems and Electronics and Communication Engineering.`;
  } else if (lowerInput.includes("skills") || lowerInput.includes("expertise")) {
    return `${personalInfo.name}'s key skills include ${personalInfo.skills.join(", ")}.`;
  } else if (lowerInput.includes("experience") || lowerInput.includes("work")) {
    return personalInfo.experience.map(exp => `${exp.title} at ${exp.company} (${exp.period}): ${exp.description}`).join("\n\n");
  } else if (lowerInput.includes("projects")) {
    return personalInfo.projects.map(p => `${p.name}: ${p.description}`).join("\n\n");
  } else if (lowerInput.includes("education")) {
    return personalInfo.education.map(edu => `${edu.degree} from ${edu.school} (${edu.year})`).join("\n\n");
  } else if (lowerInput.includes("certifications")) {
    return `${personalInfo.name} holds the following certifications: ${personalInfo.certifications.join(", ")}.`;
  } else if (lowerInput.includes("contact") || lowerInput.includes("reach")) {
    return `You can contact ${personalInfo.name} via:\nEmail: ${personalInfo.contact.email}\nPhone: ${personalInfo.contact.phone}\nLinkedIn: ${personalInfo.contact.linkedin}\nGitHub: ${personalInfo.contact.github}`;
  } else {
    return `I'm sorry, I don't have specific information about that. Would you like to know about ${personalInfo.name}'s background, skills, experience, projects, education, certifications, or contact information?`;
  }
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = { type: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = { type: 'ai', content: getAIResponse(inputValue) };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuestionClick = (question) => {
    setInputValue(question);
    handleSendMessage();
  };

  return (
    <ThemeProvider theme={theme}>
      <motion.div
        className="fixed bottom-5 right-5 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="contained"
          style={{ 
            minWidth: '48px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
          }}
          onClick={() => setIsOpen(!isOpen)} 
        >
          <SmartToyIcon />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-5 w-96 z-40"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader
                title="AI Portfolio Assistant"
                subheader={`${personalInfo.name} - ${personalInfo.role}`}
                style={{ backgroundColor: colors.accent, color: colors.primary }}
              />
              <CardContent style={{ backgroundColor: colors.secondary, height: '400px', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
                  {messages.map((msg, index) => (
                    <motion.div 
                      key={index} 
                      style={{
                        display: 'flex',
                        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '8px',
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          maxWidth: '80%',
                          backgroundColor: msg.type === 'user' ? colors.accent : colors.primary,
                          color: msg.type === 'user' ? colors.primary : colors.accent,
                        }}
                      >
                        <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                          {msg.content}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                      <CircularProgress size={20} style={{ color: colors.accent }} />
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {['skills', 'experience', 'education', 'projects', 'contact'].map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleQuestionClick(`Tell me about Aadhithya's ${category}`)}
                      style={{ backgroundColor: colors.accent, color: colors.primary }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about Aadhithya's portfolio..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      style: { color: colors.text }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    endIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default AIChatbot;