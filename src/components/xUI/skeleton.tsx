import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("animate-pulse rounded-md bg-muted dark:bg-[#232329]", className)} {...props} />;
}

export { Skeleton };
