import { FiArrowRight, FiLoader } from 'react-icons/fi'
import '../styles/PrimaryButton.css'

function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  fullWidth = false,
  variant = 'primary', // 'primary' or 'secondary'
  icon = true,
  type = 'button',
  className = ''
}) {
  return (
    <button
      type={type}
      className={`primary-btn ${variant} ${fullWidth ? 'full-width' : ''} ${disabled || loading ? 'disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className="btn-content">
        <span className="btn-text">{children}</span>
        {loading ? (
          <FiLoader className="btn-icon loading" />
        ) : icon ? (
          <FiArrowRight className="btn-icon" />
        ) : null}
      </span>
      <span className="btn-shine"></span>
    </button>
  )
}

export default PrimaryButton
