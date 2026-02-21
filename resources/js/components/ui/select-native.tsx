import { ChevronDown } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * A styled <select> wrapper that visually matches the shadcn Input component.
 * Usage: <Select value={...} onChange={...}> <option>...</option> </Select>
 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
    return (
        <div className="relative">
            <select
                data-slot="select"
                className={cn(
                    "border-input bg-background text-foreground appearance-none w-full flex h-9 rounded-md border px-3 pr-8 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
    )
}

export { Select }
