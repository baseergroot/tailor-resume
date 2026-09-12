import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "mm-input w-full min-w-0 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-mm-ink placeholder:text-mm-stone focus-visible:border-mm-blue-deep focus-visible:border-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-mm-surface disabled:opacity-50 aria-invalid:border-mm-error aria-invalid:ring-0 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
