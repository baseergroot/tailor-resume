import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[60px] w-full rounded-lg border border-mm-hairline bg-mm-canvas px-3 py-2 text-base text-mm-ink transition-colors placeholder:text-mm-stone focus-visible:border-mm-blue-deep focus-visible:border-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
