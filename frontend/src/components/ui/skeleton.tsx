import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-slate-200/70 skeleton-shimmer",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
