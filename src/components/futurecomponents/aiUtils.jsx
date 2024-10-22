// aiUtils.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI("AIzaSyCO5OmKLtYE-6ejk68g9pJuF82DWsGiVa8");

// Helper function to get a chat model
const getChatModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

export const generateProjectDescription = async (projectName) => {
  try {
    const model = getChatModel();
    const prompt = `Generate a brief, engaging description for a project named ${projectName}.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating project description:", error);
    return "An innovative project showcasing cutting-edge technology and creative problem-solving.";
  }
};

export const analyzeSentiment = async (text) => {
  try {
    const model = getChatModel();
    const prompt = `Analyze the sentiment of the following text and respond with a number between 0 and 1, where 0 is very negative and 1 is very positive: "${text}"`;
    const result = await model.generateContent(prompt);
    return parseFloat(result.response.text());
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0.5; // Neutral sentiment as fallback
  }
};

export const getChatbotResponse = async (userInput) => {
  try {
    const model = getChatModel();
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            { text: "You are a helpful assistant for a portfolio website." },
            { text: "Provide concise, informative responses." }
          ]
        },
        {
          role: "model",
          parts: [
            { text: "Understood. I'm ready to assist with concise and informative responses for your portfolio website." },
            { text: "How can I help you today?" }
          ]
        }
      ],
    });
    const result = await chat.sendMessage(userInput);
    return result.response.text();
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "I'm sorry, I couldn't process that request. How else can I assist you?";
  }
};

export const getPersonalizedColors = async () => {
  try {
    const model = getChatModel();
    const prompt = "Generate a modern, professional indigo color scheme for a portfolio website. Provide a JSON object with 'primary' and 'secondary' color hex codes.";
    const result = await model.generateContent(prompt);
    console.log("Color result:", result.response.candidates[0].content.parts[0].text);
    const cleanedText = result.response.candidates[0].content.parts[0].text.replace(/```json|```|\n/g, '')
    // return JSON.parse(cleanedText);
    return { primary: '#081941', secondary: '#0e7f9b' };
  } catch (error) {
    console.error("Error generating personalized colors:", error);
    return { primary: '#6200ea', secondary: '#03dac6' }; // Default colors as fallback
  }
};