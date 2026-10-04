import { forwardRef } from 'react'

const VARIANTS = {
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:scale-[0.98]',
  secondary:
    'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-[0.98]',
  outline:
    'bg-transparent hover:bg-blue-50/60 text-blue-600 border border-blue-200/90 active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-slate-100/80 text-slate-600 active:scale-[0.98]',
  soft:
    'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border border-blue-100 active:scale-[0.98]',
  danger:
    'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-[0.98]',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.2 text-sm rounded-xl gap-2',
  lg: 'px-5 py-2.8 text-base rounded-xl gap-2.5',
}

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    type = 'button',
    icon: Icon,
    iconRight: IconRight,
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variantClass = VARIANTS[variant] || VARIANTS.primary
  const sizeClass = SIZES[size] || SIZES.md

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'h-3.5 w-3.5 shrink-0' : 'h-4 w-4 shrink-0'} />
      ) : null}
      <span>{children}</span>
      {!loading && IconRight ? (
        <IconRight className={size === 'sm' ? 'h-3.5 w-3.5 shrink-0' : 'h-4 w-4 shrink-0'} />
      ) : null}
    </button>
  )
})

export default Button
