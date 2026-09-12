import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "mm-badge inline-flex shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap transition-all",
  {
    variants: {
      variant: {
        default: "mm-badge-new",
        secondary: "bg-mm-surface text-mm-steel",
        destructive: "bg-mm-error/10 text-mm-error",
        outline: "border border-mm-hairline text-mm-ink bg-transparent",
        success: "mm-badge-success",
        beta: "mm-badge-beta",
        code: "mm-badge-code",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
