import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      orientation="vertical"
      className="flex touch-none select-none border-l border-transparent p-0.5 transition-colors"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-300 dark:bg-gray-700" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Scrollbar
      orientation="horizontal"
      className="flex touch-none select-none border-t border-transparent p-0.5 transition-colors"
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-300 dark:bg-gray-700" />
    </ScrollAreaPrimitive.Scrollbar>
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea };
