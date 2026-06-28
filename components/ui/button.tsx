import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background/60 hover:bg-secondary",
        link: "text-accent underline-offset-4 hover:underline",
        primary: "bg-accent text-accent-foreground shadow-sm hover:opacity-90",
        primaryOutline: "border border-accent/40 bg-background text-accent hover:bg-accent/10",
        secondary: "bg-green-500 text-white shadow-sm hover:bg-green-600",
        secondaryOutline: "border border-green-500/40 bg-background text-green-600 hover:bg-green-500/10",
        danger: "bg-rose-500 text-white shadow-sm hover:bg-rose-600",
        dangerOutline: "border border-rose-500/40 bg-background text-rose-600 hover:bg-rose-500/10",
        super: "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
        superOutline: "border border-border bg-background text-foreground hover:bg-secondary",
        ghost: "bg-transparent hover:bg-secondary",
        sidebar: "bg-transparent text-muted-foreground hover:bg-secondary transition-none",
        sidebarOutline: "bg-accent/10 text-accent border border-accent/30 transition-none",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonVariant = VariantProps<typeof buttonVariants>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariant {
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };


