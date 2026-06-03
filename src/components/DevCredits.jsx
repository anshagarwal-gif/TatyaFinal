import '../styles/DevCredits.css'

export default function DevCredits({ variant = 'light' }) {
  return (
    <footer className={`dev-credits dev-credits--${variant}`}>
      Developed by Ansh Agarwal, Dev Sagani and Krishnaraj Bhosale
    </footer>
  )
}
