import Image from "next/image"

interface PartnerLogoProps {
  name: string
  logo: string
}

export function PartnerLogo({ name, logo }: PartnerLogoProps) {
  return (
    <div className="relative h-12 transition-all duration-300 hover:scale-110 filter grayscale hover:grayscale-0">
      <Image
        src={logo}
        alt={name}
        fill
        className="object-contain"
      />
    </div>
  )
}

