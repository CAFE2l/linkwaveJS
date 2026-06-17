import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div className={cn("card p-5 text-center", className)}>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs font-medium text-fg-secondary uppercase tracking-wider">{label}</p>
    </div>
  );
}
