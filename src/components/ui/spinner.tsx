import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: "default" | "sm" | "lg" | "icon"
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      default: "size-4",
      sm: "size-3",
      lg: "size-6",
      icon: "size-5",
    }

    return (
      <Loader2
        ref={ref}
        className={cn("animate-spin", sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }
