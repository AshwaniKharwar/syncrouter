import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[8px] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-text-on hover:bg-accent-hover active:bg-accent-hover/90 font-medium shadow-xs",
        outline:
          "border-border bg-surface text-text-primary hover:bg-surface-hover hover:text-text-primary aria-expanded:bg-surface-hover aria-expanded:text-text-primary",
        secondary:
          "bg-surface-hover text-text-primary hover:bg-surface-hover/80 hover:text-text-primary aria-expanded:bg-surface-hover",
        ghost:
          "text-text-secondary hover:bg-surface-hover hover:text-text-primary aria-expanded:bg-surface-hover aria-expanded:text-text-primary",
        destructive:
          "bg-danger-bg text-danger border border-danger/20 hover:bg-danger/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 rounded-[6px] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[8px] px-2.5 text-[13px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8 rounded-[8px]",
        "icon-xs":
          "size-6 rounded-[6px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[8px]",
        "icon-lg": "size-9 rounded-[8px]",
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
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={render ? false : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
