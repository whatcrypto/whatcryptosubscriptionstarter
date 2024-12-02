import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading: boolean;
}

const Button2 = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, loading, children, ...props }, ref) => {
    return (
        <Button disabled={loading} className={className} {...props} ref={ref}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} {children}
        </Button>
    );
});
Button2.displayName = "Button2";
export default Button2;
