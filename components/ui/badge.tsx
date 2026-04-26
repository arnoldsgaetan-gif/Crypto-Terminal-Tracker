import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "warning";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:     "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  secondary:   "bg-zinc-700 text-zinc-300",
  outline:     "border border-zinc-600 text-zinc-300",
  destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
  warning:     "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
