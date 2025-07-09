import { Loader2 } from "lucide-react"

const LoadingSpinner = ({ size = "md", text = "Loading...", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-4`} />
      <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{text}</p>
    </div>
  )
}

export default LoadingSpinner
