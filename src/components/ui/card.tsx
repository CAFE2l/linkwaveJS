import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("glass-panel rounded-[1.75rem]", className)} {...props} />;
  },
);
Card.displayName = "Card";
