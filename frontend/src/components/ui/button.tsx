import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-teal-700 hover:bg-teal-800 text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98]",
        primary3d:
          "btn-3d-primary",
        navy3d:
          "btn-3d-navy",
        emergency3d:
          "btn-3d-emergency",
        glass3d:
          "btn-3d-glass text-slate-800",
        outline:
          "border-slate-200/90 bg-white/80 backdrop-blur-sm hover:bg-slate-50 hover:text-slate-900 text-slate-700 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0.5",
        secondary:
          "bg-teal-50 text-teal-800 border border-teal-100 hover:bg-teal-100 hover:-translate-y-0.5 active:translate-y-0.5",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
        destructive:
          "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0.5",
        link: "text-teal-700 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 rounded-xl px-5 text-sm font-bold",
        xl: "h-12 gap-2.5 rounded-2xl px-6 text-base font-bold",
        icon: "size-9 rounded-xl",
        "icon-xs":
          "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-lg",
        "icon-lg": "size-10 rounded-xl",
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
