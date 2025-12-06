import Card from "../common/Card";
import { ReactNode } from "react";

type Props = { title: string; value: string | number; icon?: ReactNode; color?: "primary" | "secondary" | "accent" };

export default function StatCard({ title, value, icon, color = "primary" }: Props) {
  const bg = color === "primary" ? "bg-primary/10" : color === "secondary" ? "bg-secondary/10" : "bg-accent/10";
  const text = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3">
        {icon && <div className={`w-10 h-10 rounded ${bg} grid place-items-center ${text}`}>{icon}</div>}
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
      </div>
    </Card>
  );
}
