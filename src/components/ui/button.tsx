import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "mm-btn inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "mm-btn-primary",
        outline: "mm-btn-secondary",
        secondary: "mm-btn-tertiary",
        ghost: "bg-transparent text-mm-steel hover:text-mm-ink hover:bg-mm-surface rounded-full",
        destructive: "bg-mm-error/10 text-mm-error hover:bg-mm-error/20 rounded-full",
        link: "bg-transparent text-mm-ink underline-offset-4 hover:underline rounded-none px-0 py-2",
        "icon-circular": "mm-btn bg-mm-canvas text-mm-ink border border-mm-hairline rounded-full size-9 p-0",
      },
      size: {
        default: "h-10 gap-1.5 px-6 text-sm",
        xs: "h-6 gap-1 rounded-full px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-full px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-6 text-sm",
        icon: "size-9 rounded-full p-0",
        "icon-xs": "size-6 rounded-full p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-full p-0",
        "icon-lg": "size-9 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
