"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-cta data-[state=on]:text-cta-foreground",
  {
    variants: {
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2 text-xs",
      },
    },
    defaultVariants: { size: "default" },
  }
);

const ToggleGroup = ToggleGroupPrimitive.Root;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>
>(({ className, size, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleVariants({ size }), className)} {...props} />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
