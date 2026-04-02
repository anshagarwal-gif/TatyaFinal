import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star,Mic, Camera, Bell, Search } from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import { useLanguage } from '../contexts/LanguageContext'
import { translate } from '../utils/translations'
import sprayingHomeImage from '../assets/SprayingHomeImage.png'
import sowingHomeImage from '../assets/SowingHomeImage.png'
import harvestHomeImage from '../assets/HarvestHomeImage.png'
import machineHomeImage from '../assets/MachineHomeImage.png'
import storageHomeImage from '../assets/StorageHomeImage.png'
import sprayingDrone3 from '../assets/SprayingDrone3.jpg'
import sprayingRover from '../assets/SprayingRover1.jpg'
import sprayingTractor1 from '../assets/SprayingTractor1.png'
import tatyaVideoLogo from '../assets/TatyaVideoLogo.mp4'
import offerImage1 from '../assets/OfferImage1.png'
import offerImage2 from '../assets/OfferImage2.png'
import offerImage3 from '../assets/OfferImage3.png'
import ChatbotWrapper from '../chatbot/ChatbotWrapper';
import { useSpeechToText } from '../chatbot/hooks/useSpeechToText'
import '../styles/TatyaHomePage.css'

export default function TatyaHomePage() {
  const { isMarathi } = useLanguage()
  const [message, setMessage] = useState('')
  const [selectedService, setSelectedService] = useState('spraying')
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMsg, setInitialChatMsg] = useState('');
  const [initialChatRequestId, setInitialChatRequestId] = useState('');
  const [shouldCameraOpen, setShouldCameraOpen] = useState(false);
  const navigate = useNavigate()

  const { isListening, toggleListening, stopListening, error } = useSpeechToText((text) => {
    setMessage(text);
  });

  const services = [
    { id: 'spraying', label: 'Spraying', emoji: '💦', image: sprayingHomeImage },
    { id: 'sowing', label: 'Sowing', emoji: '🌱', image: sowingHomeImage },
    { id: 'harvest', label: 'Harvest', emoji: '🌾', image: harvestHomeImage },
    { id: 'machine', label: 'Machine', emoji: '🚜', image: machineHomeImage },
    { id: 'storage', label: 'Storage', emoji: '🗄️', image: storageHomeImage }
  ]

  const equipmentByService = {
    spraying: [
      {
        id: 1,
        title: 'Night Spraying Drone',
        rating: 4.5,
        image: sprayingDrone3
      },
      {
        id: 2,
        title: 'Spraying Rover',
        rating: 4.4,
        image: sprayingRover
      },
      {
        id: 3,
        title: 'Spraying Tractor',
        rating: 4.1,
        image: sprayingTractor1
      }
    ],
    sowing: [],
    harvest: [],
    machine: [],
    storage: []
  }

  const promoBanners = [
    { id: 1, image: offerImage1 },
    { id: 2, image: offerImage2 },
    { id: 3, image: offerImage3 }
  ]

  const equipmentCards = equipmentByService[selectedService] || []

  const handleOpenChat = () => {
    if (message.trim() !== '') {
      stopListening()
      setInitialChatMsg(message)
      setInitialChatRequestId(`home-chat-${Date.now()}`)
      setIsChatOpen(true)
      setMessage('') // Clears the input on the home screen
    }
  }

  const handleCameraClick = () => {
    // We open the chat with a special flag or just open it empty 
    // so the user can use the camera inside the popup
    setIsChatOpen(true);
    // Optional: You could pass a prop to ChatbotWrapper to auto-trigger the camera
  };

  const handleCameraIconClick = () => {
    setShouldCameraOpen(true);
    setInitialChatMsg(''); // Ensure no text is passed
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setShouldCameraOpen(false);
  };

  return (
    <div className="tatya-home-page">
      <div className="tatya-phone-shell">
        <div className="tatya-phone-content">
          {/* Chat header like original design */}
          <div className="tatya-chat-header">
            <div className="tatya-chat-header-top">
              <div className="tatya-chat-header-left">
                <div className="tatya-chat-avatar">
                  <video
                    className="tatya-logo-video"
                    src={tatyaVideoLogo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                </div>
                <span className="tatya-chat-greeting">Tatya</span>
              </div>
              <div className="tatya-chat-header-right">
                <div className="tatya-chat-lang-wrap">
                  <LanguageToggle />
                </div>
                <button type="button" className="tatya-chat-bell" aria-label="Notifications">
                  <Bell size={20} />
                </button>
              </div>
            </div>
            <h2 className="tatya-chat-title">
              तुमच्या शेताबद्दल <br/> काहीही विचारा
            </h2>
            <div className="tatya-chat-input-row">
  <input
    className="tatya-chat-input"
    placeholder="इथे संदेश लिहा..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleOpenChat()}
  />

  {/* Only the icons live here. This stays stable in the middle-right. */}
  <div className="tatya-input-actions">
    <button 
      type="button" 
      onClick={toggleListening}
      className={`tatya-icon-btn ${isListening ? 'is-active' : ''}`}
    >
      <Mic size={20} color={isListening ? "#16a34a" : "#666"} />
      {isListening && <span className="mic-pulse-dot"></span>}
    </button>

    <div className="tatya-divider-v"></div>

    <button 
      type="button" 
      onClick={handleCameraIconClick}
      className="tatya-icon-btn"
    >
      <Camera size={20} color="#666" />
    </button>
  </div>

  {/* The Send Button is now OUTSIDE the actions div. 
      It will always appear at the very end (far right).
  */}
  {message.trim().length > 0 && (
    <button 
      type="button" 
      className={isListening ? "tatya-voice-confirm-btn" : "tatya-chat-send-btn"}
      onClick={handleOpenChat}
    >
      पाठवा
    </button>
  )}
</div>
          </div>

          {/* Service selection */}
          <section className="tatya-section">
            <h3 className="tatya-section-title">
              {translate('Select Service', isMarathi)}
            </h3>
            <div className="tatya-service-row">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`tatya-service-pill ${
                    selectedService === service.id ? 'active' : ''
                  }`}
                >
                  <span className="tatya-service-label">
                    {service.emoji} {translate(service.label, isMarathi)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Equipment cards */}
          <section className="tatya-section">
            <div className="tatya-section-header-row">
              <h3 className="tatya-section-title">
                {translate('Popular', isMarathi)}
              </h3>
              <button type="button" className="tatya-sort-chip">
                ⇅ {translate('Popular', isMarathi)}
              </button>
            </div>
            {equipmentCards.length > 0 ? (
              <div className="tatya-equipment-row">
                {equipmentCards.map((card) => (
                  <div
                    key={card.id}
                    className="tatya-equipment-card"
                    style={{ backgroundImage: `url(${card.image})` }}
                  >
                    <div className="tatya-equipment-badge">70% OFF</div>
                    <button type="button" className="tatya-save-icon">
                      ♡
                    </button>
                    <div className="tatya-equipment-overlay">
                      <div className="tatya-equipment-bottom">
                        <div className="tatya-rating-pill">
                          <span className="tatya-rating-value">
                            {card.rating.toFixed(1)}
                          </span>
                          <Star size={12} className="tatya-rating-star" />
                        </div>
                        <button
                          type="button"
                          className="tatya-book-btn"
                          onClick={() => navigate('/location')}
                        >
                          <span className="tatya-book-icon">★</span>
                          <span>{translate('Book', isMarathi)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tatya-empty-state">
                <p className="tatya-empty-text">
                  {translate('Nothing here', isMarathi)}
                </p>
              </div>
            )}
          </section>

          {/* Promo banners */}
          <section className="tatya-section tatya-promo-section">
            <div className="tatya-promo-row">
              {promoBanners.map((banner) => (
                <div key={banner.id} className="tatya-promo-card">
                  <img
                    src={banner.image}
                    alt="Tatya offer"
                    className="tatya-promo-image"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Chatbot Popup Overlay */}
          {isChatOpen && (
            <div className="tatya-chatbot-popup-overlay">
              <div className="tatya-chatbot-container">
                <button 
                  className="tatya-close-chat" 
                  onClick={handleCloseChat}
                >
                  ✕
                </button>
                {/* Ensure ChatbotWrapper is imported at the top of the file */}
                <ChatbotWrapper 
                  initialMessage={initialChatMsg} 
                  initialMessageId={initialChatRequestId}
                  onClose={handleCloseChat} 
                  onNavigateToUserData={() => navigate('/userdata')} 
                  startWithCamera={shouldCameraOpen}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

