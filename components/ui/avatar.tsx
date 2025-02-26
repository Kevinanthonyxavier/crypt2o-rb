
import * as React from "react";
import Image, { StaticImageData } from "next/image"; // ✅ Import Next.js Image
import { cn } from "@/lib/utils";

// Define a fallback avatar image (optional)
const defaultAvatar = "/default-avatar.png"; // Change this to your default avatar path

const Avatar = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, Omit<React.ComponentPropsWithoutRef<typeof Image>, "ref"> & { src?: string | StaticImageData }>(
  ({ className, alt = "User Avatar", src, width = 40, height = 40, ...props }) => (
    <Image
      className={cn("aspect-square h-full w-full", className)}
      src={src || defaultAvatar} // ✅ Fallback image
      alt={alt}
      width={width} // ✅ Default width
      height={height} // ✅ Default height
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";


const AvatarFallback = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
      {...props}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
