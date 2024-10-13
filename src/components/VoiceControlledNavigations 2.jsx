import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

const VoiceControlledNavigation = () => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let recognition;
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.toLowerCase();
            if (transcript.includes('go to projects')) {
              window.location.href = '#projects';
            } else if (transcript.includes('go to about')) {
              window.location.href = '#about';
            }
            // Add more voice commands as needed
          }
        }
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      window.webkitSpeechRecognition.start();
    } else {
      window.webkitSpeechRecognition.stop();
    }
  };

  return (
    <Button 
      icon={isListening ? "pi pi-microphone" : "pi pi-microphone-slash"} 
      onClick={toggleListening} 
      className={`p-button-rounded ${isListening ? 'p-button-danger' : 'p-button-secondary'}`}
      tooltip="Voice Navigation"
      tooltipOptions={{ position: 'left' }}
    />
  );
};

export default VoiceControlledNavigation;