import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 border font-serif text-[0.95rem] font-medium whitespace-nowrap normal-case tracking-normal transition-colors duration-300 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-accent bg-accent text-paper hover:border-ink hover:bg-ink",
        outline:
          "border-rule bg-transparent text-ink hover:border-accent hover:text-accent",
        ghost:
          "border-transparent bg-transparent text-ink hover:text-accent",
        link: "border-transparent bg-transparent p-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-[0.9rem] max-md:h-11",
        lg: "h-12 px-6",
        icon: "size-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
