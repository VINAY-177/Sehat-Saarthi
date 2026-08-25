import { Urgency } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UrgencyBadgeProps {
  urgency: Urgency | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UrgencyBadge({ urgency, size = 'md', className }: UrgencyBadgeProps) {
  const getUrgencyConfig = (u: Urgency | string) => {
    const norm = typeof u === 'string' ? u.toUpperCase() : u;
    switch (norm) {
      case Urgency.LOW:
      case 'LOW':
      case 'NORMAL':
        return { label: "Low Risk", classes: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold" };
      case Urgency.MODERATE:
      case 'MODERATE':
      case 'MEDIUM':
        return { label: "Moderate", classes: "bg-amber-50 text-amber-700 border-amber-200 font-semibold" };
      case Urgency.HIGH:
      case 'HIGH':
        return { label: "High Risk", classes: "bg-orange-50 text-orange-800 border-orange-200 font-semibold" };
      case Urgency.EMERGENCY:
      case 'EMERGENCY':
      case 'CRITICAL':
        return { label: "Emergency", classes: "bg-rose-600 text-white border-rose-700 font-bold shadow-xs animate-pulse" };
      default:
        return { label: "Standard", classes: "bg-slate-50 text-slate-600 border-slate-200 font-medium" };
    }
  };

  const config = getUrgencyConfig(urgency);
  
  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 rounded-lg",
    md: "text-xs px-2.5 py-1 rounded-xl",
    lg: "text-sm px-3.5 py-1.5 rounded-xl font-bold",
  };

  return (
    <Badge 
      variant="outline"
      className={cn(
        "border",
        config.classes,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
