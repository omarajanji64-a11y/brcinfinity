import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.85rem] border px-4 text-sm font-medium tracking-[0.04em] ring-offset-background transition-[transform,background-color,border-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:-translate-y-[1px] active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-[rgba(255,255,255,0.08)] bg-[rgba(168,147,122,0.18)] text-primary shadow-[0_12px_28px_rgba(0,0,0,0.2)] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(168,147,122,0.28)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-primary shadow-[0_10px_22px_rgba(0,0,0,0.12)] hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.07)] hover:text-primary hover:shadow-[0_16px_30px_rgba(0,0,0,0.2)]",
        secondary:
          "border-[rgba(255,255,255,0.06)] bg-secondary text-secondary-foreground hover:bg-[rgba(255,255,255,0.08)]",
        ghost: "border-transparent bg-transparent text-primary hover:bg-[rgba(255,255,255,0.05)] hover:text-primary",
        link: "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
