interface CyberBorderProps {
    children: React.ReactNode
    className?: string
  }
  
  export function CyberBorder({ children, className = "" }: CyberBorderProps) {
    return (
      <div className={`relative group ${className}`}>
        {/* Top left corner */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Top right corner */}
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Bottom left corner */}
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Bottom right corner */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    )
  }
  
  