"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

type ExtraProps = {
    buttonClassName?: string;
};

type SwitchType = React.ForwardRefExoticComponent<SwitchPrimitives.SwitchProps & ExtraProps & React.RefAttributes<HTMLButtonElement>>;

const Switch = React.forwardRef<React.ElementRef<SwitchType>, React.ComponentPropsWithoutRef<SwitchType>>(({ className, buttonClassName, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            "peer inline-flex h-[24px] w-[44px] shrink-0 border-[#E6E9EF] cursor-pointer items-center bg-[#f2f4fa] dark:bg-[#111116] dark:border-[#7b7c7c] rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:cursor-not-allowed disabled:opacity-50",
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-[#ffcf30] shadow-lg ring-0 transition-transform  data-[state=checked]:translate-x-[24px] data-[state=unchecked]:translate-x-[3px]",
                buttonClassName,
            )}
        />
    </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
