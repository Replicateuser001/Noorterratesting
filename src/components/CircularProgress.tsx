import { useEffect, useState } from 'react'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  label: string
  animate?: boolean
}

const CircularProgress = ({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  animate = true,
}: CircularProgressProps) => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setProgress(value)
    }
  }, [value, animate])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Color calculation based on percentage
  const getColor = (percentage: number) => {
    if (percentage < 40) return '#ef4444' // red
    if (percentage < 70) return '#eab308' // yellow
    return '#22c55e' // green
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          className="absolute transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(progress)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: animate ? 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' : 'none'
            }}
          />
        </svg>
        
        {/* Percentage text */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: getColor(progress) }}
        >
          <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-2 text-sm text-gray-300 text-center">
        {label}
      </div>
    </div>
  )
}

export default CircularProgress