import { cn } from "../../utils/cn";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "accent" };

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base = "px-4 py-2 rounded text-white";
  const styles = {
    primary: "bg-primary hover:brightness-110",
    secondary: "bg-secondary hover:brightness-110",
    accent: "bg-accent hover:brightness-110",
  }[variant];
  return <button className={cn(base, styles, className)} {...props} />;
}
