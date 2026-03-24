import React from 'react';
import root from 'react-shadow';
import ChatBox from './components/ChatBox'; 
import chatbotStyles from './chatbot.css?inline'; 

const ChatbotWrapper = ({ onClose, onNavigateToUserData, initialMessage, startWithCamera }) => { 
  return (
    <root.div>
      <style>{chatbotStyles}</style>
      <div className="chatbot-modal-overlay">
        <div className="chatbot-panel">
          <div className="chatbot-body">
            <ChatBox 
              onNavigateToUserData={onNavigateToUserData} 
              onClose={onClose} 
              initialMessage={initialMessage} // Pass it down to ChatBox
              startWithCamera={startWithCamera}
            />
          </div>
        </div>
      </div>

      <style>{`
  .chatbot-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.2);
    z-index: 9999999;
    display: flex;
    justify-content: flex-end;
    align-items: center; 
    padding-right: 20px; 
  }
  
  .chatbot-panel {
    width: 400px;
    height: 90%; 
    background: white;
    box-shadow: -5px 0 25px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    border-radius: 2.5rem; 
    overflow: hidden; 
    
    /* ADD THIS: Padding at the bottom prevents buttons from touching the edge */
    padding-bottom: 20px; 
  }

  .chatbot-header {
    padding: 15px;
    background: #10b981;
    color: white;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    /* Remove if you already have the header removed as per previous request */
  }

  .close-x {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }

  .chatbot-body {
    flex: 1;
    /* Changed from hidden to auto to allow the inner buttons to stay visible */
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
  }
`}</style>
    </root.div>
  );
};

export default ChatbotWrapper;
