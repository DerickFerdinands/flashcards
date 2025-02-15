"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    onChange?: (value: number) => void;
    readonly?: boolean;
    max?: number;
}

export function Rating({
                           value,
                           onChange,
                           readonly = false,
                           max = 5,
                           className,
                           ...props
                       }: RatingProps) {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    return (
        <div
            className={cn("flex gap-1", className)}
            {...props}
        >
            {[...Array(max)].map((_, index) => {
                const starValue = index + 1;
                const filled = hoverValue !== null
                    ? starValue <= hoverValue
                    : starValue <= value;

                return (
                    <button
                        key={index}
                        type="button"
                        className={cn(
                            "p-0.5 transition-colors",
                            !readonly && "hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400",
                            filled ? "text-yellow-400" : "text-muted-foreground",
                            readonly && "cursor-default"
                        )}
                        disabled={readonly}
                        onClick={() => onChange?.(starValue)}
                        onMouseEnter={() => !readonly && setHoverValue(starValue)}
                        onMouseLeave={() => !readonly && setHoverValue(null)}
                    >
                        <Star className="h-5 w-5 fill-current" />
                    </button>
                );
            })}
        </div>
    );
}
