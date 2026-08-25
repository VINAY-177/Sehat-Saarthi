import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpIcon className="h-3.5 w-3.5 text-emerald-600" />;
    if (trend === 'down') return <ArrowDownIcon className="h-3.5 w-3.5 text-rose-600" />;
    if (trend === 'neutral') return <MinusIcon className="h-3.5 w-3.5 text-slate-400" />;
    return null;
  };

  return (
    <Card className={cn("bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-sm transition-all overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-0.5 mt-1">
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
          {description && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
              {trend && getTrendIcon()}
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
