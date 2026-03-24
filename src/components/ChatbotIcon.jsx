import React from 'react';
import '../styles/ChatbotIcon.css'; 
import tatyaVideoLogo from '../assets/TatyaVideoLogo.mp4';

const ChatbotIcon = ({ onClick }) => {
  return (
    <button 
      className="chatbot-fixed-icon-btn" 
      onClick={onClick} 
      type="button"
    >
      <video
        className="tatya-logo-video"
        src={tatyaVideoLogo}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </button>
  );
};

export default ChatbotIcon;