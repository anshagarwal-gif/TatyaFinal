import '../styles/ProgressBar.css'

function ProgressBar({ currentStep, totalSteps, steps = [] }) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        {/* Progress Track */}
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          >
            <div className="progress-shine"></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="progress-steps">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const stepLabel = steps[index] || `Step ${stepNumber}`

            return (
              <div 
                key={stepNumber} 
                className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-circle">
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="step-number">{stepNumber}</span>
                  )}
                </div>
                <span className="step-label">{stepLabel}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress Text */}
      <div className="progress-text">
        <span className="progress-current">Step {currentStep}</span>
        <span className="progress-separator">of</span>
        <span className="progress-total">{totalSteps}</span>
      </div>
    </div>
  )
}

export default ProgressBar
