"use client"

import { useState } from "react"
import { Package } from "lucide-react"

const ImageWithFallback = ({ src, alt, className, fallbackIcon: FallbackIcon = Package, ...props }) => {
  const [imageState, setImageState] = useState("loading") // 'loading', 'success', 'error'
  const [imageSrc, setImageSrc] = useState(src)

  const handleImageLoad = () => {
    setImageState("success")
  }

  const handleImageError = () => {
    setImageState("error")
  }

  // Update image src when prop changes
  if (imageSrc !== src) {
    setImageSrc(src)
    setImageState("loading")
  }

  if (imageState === "error" || !src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} {...props}>
        <FallbackIcon className="w-6 h-6 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {imageState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${imageState == "loading" ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  )
}

export default ImageWithFallback
