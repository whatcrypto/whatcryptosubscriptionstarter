"use client";
import { cn } from "@/lib/utils";
import { ComponentProps, createElement, FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";

type Props<T extends AsType> = ComponentProps<T> & {
    /**
     * updated only the first time
     */
    defaultValue?: number;
    currentValue: number;
    className?: string;
    /**
     * HTML element to render
     * @default div
     */
    as?: T;
    /**
     * If not parsed price changed a checked against zero
     */
    compareWithPreviousValue?: boolean;
}

type AsType =  keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<unknown>;

export type TickerElement =  <T extends AsType = 'p'>(
    props: PropsWithChildren<Props<T>>
) => ReactElement;


const Ticker: FC<ComponentProps<TickerElement>> =  ({currentValue, defaultValue = currentValue, className, children, as = 'div', compareWithPreviousValue, ...props}) => {
    const [animationClassName, setAnimationClassName] = useState<'animate-price-down' | 'animate-price-up' | null>(null);
    const previousValue = useRef(defaultValue);
    const firstRender = useRef(true);
    
    useEffect(() => {
        const compareTo = compareWithPreviousValue ? previousValue.current : 0;
        let timeId: ReturnType<typeof setTimeout>;
        // console.log(compareTo, currentValue, firstRender.current);
        if(firstRender.current) {
            firstRender.current = false;
        } else {
            if(compareTo === currentValue || currentValue === previousValue.current) {
                setAnimationClassName(null);
            } else if (currentValue > compareTo) {
                setAnimationClassName('animate-price-up');
            } else {
                setAnimationClassName('animate-price-down');
            }
            timeId = setTimeout(() => {
                setAnimationClassName(null);
            }, 1500);
        }
        previousValue.current = currentValue;
        return () => {
            if(timeId) {
                clearTimeout(timeId);
            }
        };
    }, [currentValue, compareWithPreviousValue]);

    return createElement(as, {
        ...props,
        className: cn(className, animationClassName ?? '')
    }, children);
};

export default Ticker;