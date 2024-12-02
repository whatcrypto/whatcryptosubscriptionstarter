import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground border-0 outline-0",
                success: "border-transparent bg-[#e9f8f1] dark:bg-[#1a2928] dark:text-[#1DB66C] text-[#1DB66C] rounded-[4px]",
                danger: "border-transparent bg-[#ffeded] dark:bg-[#301e24] dark:text-[#FF4242] text-[#FF4242] hover:bg-[#ffeeee]",
                lessDanger: "border-transparent rounded-[4px] text-[#F47E4B] dark:text-[#fca580] bg-[#fde5db] dark:bg-[#473634]",
                lessSuccess : "border-transparent rounded-[4px] text-[#72B919] dark:text-[#b7eb75] bg-[#e3f1d1] dark:bg-[#3a4431]",
                neutral: "border-transparent rounded-[4px] text-[#E8AF0E] dark:text-[#fede83] bg-[#faefcf] dark:bg-[#484134]",
                greyish: "border-transparent bg-[#F2F4FA] dark:bg-[#111116] text-[#09090B] dark:text-[#fff] rounded-[4px]",
                successWhite: "border-transparent bg-[#52C41A] text-[#fff] hover:bg-[#52C41A]  rounded-[2px]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
    variant?: "secondary" | "success" | "danger" | "greyish" | "outline" | "ghost" | "lessDanger" | "lessSuccess" | "neutral";
}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
