import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    iconRight: IconRight,
    className = '',
    id,
    size = 'md',
    ...props
  },
  ref
) {
  const inputId = id || props.name || undefined
  const isSm = size === 'sm'

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={`${
            isSm ? 'mb-0.5 text-[10px]' : 'mb-1.5 text-xs'
          } block font-semibold uppercase tracking-wider text-slate-700`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <Icon className={`${isSm ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-slate-400`} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full border bg-white text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 ${
            isSm
              ? 'rounded-lg px-2.5 py-1 text-xs h-7 sm:h-7.5'
              : 'rounded-xl px-3.5 py-2.5 text-sm'
          } ${Icon ? (isSm ? 'pl-7.5' : 'pl-10') : ''} ${
            IconRight ? (isSm ? 'pr-8' : 'pr-10') : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-200/90 focus:border-blue-500 focus:ring-blue-100 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
        {IconRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <IconRight className={`${isSm ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-slate-400`} />
          </div>
        )}
      </div>
      {error && <p className={`${isSm ? 'mt-0.5 text-[10px]' : 'mt-1 text-xs'} text-rose-600`}>{error}</p>}
      {!error && helperText && <p className={`${isSm ? 'mt-0.5 text-[10px]' : 'mt-1 text-xs'} text-slate-500`}>{helperText}</p>}
    </div>
  )
})

export default Input
