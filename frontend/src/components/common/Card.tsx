import React from "react";
import { cn } from "../../utils/cn";

type Props = { children: React.ReactNode; className?: string };

export default function Card({ children, className }: Props) {
  return <div className={cn("rounded border bg-white shadow-sm p-4", className)}>{children}</div>;
}
