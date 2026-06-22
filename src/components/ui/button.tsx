import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md",
        secondary:
          "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm",
        ghost: "text-slate-600 hover:bg-orange-50 hover:text-orange-600",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
        soft: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        link: "text-orange-500 underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-xl",
        sm: "h-9 px-3 rounded-lg text-xs",
        lg: "h-12 px-8 rounded-xl text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
