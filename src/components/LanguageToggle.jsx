import { useLanguage } from '../contexts/LanguageContext'
import '../styles/LanguageToggle.css'

function LanguageToggle() {
  const { isMarathi, toggleLanguage } = useLanguage()

  return (
    <button 
      type="button"
      className={`language-toggle-btn ${isMarathi ? 'marathi' : 'english'}`}
      onClick={toggleLanguage}
      title={isMarathi ? 'Switch to English' : 'Switch to Marathi'}
      aria-label={isMarathi ? 'Switch to English' : 'Switch to Marathi'}
    >
      <span className={`lang-option ${!isMarathi ? 'active' : ''}`}>
        En
      </span>
      <span className={`lang-option ${isMarathi ? 'active' : ''}`}>
        म
      </span>
    </button>
  )
}

export default LanguageToggle
