import React from "react";
import { cn } from "../../utils/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return <input className={cn("px-3 py-2 border rounded w-full bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700", className)} {...props} />;
}
