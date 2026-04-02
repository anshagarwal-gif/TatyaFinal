import React from 'react';
import root from 'react-shadow';
import ChatBox from './components/ChatBox'; 
import chatbotStyles from './chatbot.css?inline'; 

const ChatbotWrapper = ({ onClose, onNavigateToUserData, initialMessage, initialMessageId, startWithCamera }) => { 
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
              initialMessageId={initialMessageId}
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
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .chatbot-panel {
      width: 90vw;
      max-width: 400px;
    }
  }

  @media (max-width: 480px) {
    .chatbot-modal-overlay {
      padding-right: 10px !important;
      padding-left: 10px !important;
    }

    .chatbot-panel {
      width: 100% !important;
      max-width: none !important;
      border-radius: 1.5rem;
    }
  }

  .chatbot-header {
    padding: 15px;
    background: #10b981;
    color: white;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
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
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
  }

  /* Input Section Styles */
  .chatbot-input-section {
    padding: 1.25rem 1.5rem 1.5rem 1.5rem !important;
    border-top: 1px solid #EDEDE7 !important;
    background-color: #FFFFFF !important;
  }

  .chatbot-input-wrapper {
    display: flex !important;
    align-items: flex-end !important;
    gap: 0.75rem !important;
    padding: 0.625rem !important;
    border-radius: 2.5rem !important;
    border: 1.5px solid #D1D5DB !important;
    background-color: #FFFFFF !important;
    transition: all 0.2s !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
  }

  .chatbot-textarea {
    flex: 1 !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    padding: 0.625rem 0.75rem !important;
    resize: none !important;
    max-height: 8rem !important;
    min-height: 2.5rem !important;
    font-weight: 500 !important;
    color: #1f2937 !important;
    font-family: inherit !important;
    font-size: 0.9375rem !important;
    line-height: 1.5 !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
  }

  .chatbot-textarea::placeholder {
    color: #9b8b61 !important;
    opacity: 0.6 !important;
  }

  .chatbot-textarea::-webkit-scrollbar {
    display: none !important;
  }

  .chatbot-send-button {
    padding: 0.625rem !important;
    color: white !important;
    background-color: #6b8550 !important;
    border-radius: 100% !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    min-width: 2.5rem !important;
    min-height: 2.5rem !important;
  }

  .chatbot-send-button:hover:not(:disabled) {
    background-color: #5e7646 !important;
  }

  .chatbot-send-button:disabled {
    opacity: 1 !important;
    cursor: not-allowed !important;
  }

  /* Hide file inputs */
  input[type="file"] {
    display: none !important;
  }
`}</style>
    </root.div>
  );
};

export default ChatbotWrapper;
