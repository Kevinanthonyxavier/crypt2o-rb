interface HologramEffectProps {
    children: React.ReactNode
    className?: string
  }
  
  export function HologramEffect({ children, className = "" }: HologramEffectProps) {
    return (
      <div className={`relative group ${className}`}>
        {/* Hologram scanline effect */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 animate-scan">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent transform translate-y-full" />
          </div>
        </div>
        
        {/* Glitch effect layers */}
        <div className="relative">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 translate-x-[1px] translate-y-[1px] text-pink-500/30 animate-glitch-1">
              {children}
            </div>
            <div className="absolute inset-0 -translate-x-[1px] -translate-y-[1px] text-purple-500/30 animate-glitch-2">
              {children}
            </div>
          </div>
          
          {/* Original content */}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    )
  }
  
  