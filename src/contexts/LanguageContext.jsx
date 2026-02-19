import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to true (Marathi)
  // Marathi is the primary/default language for all users
  const [isMarathi, setIsMarathi] = useState(() => {
    // Check if we've migrated to Marathi default (one-time migration)
    const marathiDefaultMigrated = localStorage.getItem('marathiDefaultMigrated')
    
    // If migration hasn't happened yet, set Marathi as default for everyone
    // This ensures Marathi is the default when someone opens the website
    if (marathiDefaultMigrated !== 'true') {
      localStorage.setItem('isMarathi', JSON.stringify(true))
      localStorage.setItem('marathiDefaultMigrated', 'true')
      return true // Default to Marathi
    }
    
    // After migration, check saved preference
    // Users can change it to English if they want, and it will be remembered
    const saved = localStorage.getItem('isMarathi')
    // Default to Marathi (true) if no saved preference exists
    if (saved === null) {
      return true
    }
    // Parse saved value - respect user's choice if they've changed it
    try {
      return JSON.parse(saved)
    } catch {
      // If parsing fails, default to Marathi
      return true
    }
  })

  // Ensure Marathi is set as default on mount (migration)
  useEffect(() => {
    const marathiDefaultMigrated = localStorage.getItem('marathiDefaultMigrated')
    if (marathiDefaultMigrated !== 'true') {
      // First time loading - set Marathi as default for everyone
      setIsMarathi(true)
      localStorage.setItem('isMarathi', JSON.stringify(true))
      localStorage.setItem('marathiDefaultMigrated', 'true')
    } else {
      // After migration, ensure Marathi is set if no preference exists
      const saved = localStorage.getItem('isMarathi')
      if (saved === null) {
        setIsMarathi(true)
        localStorage.setItem('isMarathi', JSON.stringify(true))
      }
    }
  }, [])

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isMarathi', JSON.stringify(isMarathi))
  }, [isMarathi])

  const toggleLanguage = () => {
    setIsMarathi(prev => !prev)
  }

  return (
    <LanguageContext.Provider value={{ isMarathi, setIsMarathi, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
