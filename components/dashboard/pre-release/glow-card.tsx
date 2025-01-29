interface GlowCardProps {
    children: React.ReactNode
    className?: string
  }
  
  export function GlowCard({ children, className = "" }: GlowCardProps) {
    return (
      <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-gray-800 rounded-lg leading-none flex items-center divide-x divide-gray-600">
          {children}
        </div>
      </div>
    )
  }
  
  