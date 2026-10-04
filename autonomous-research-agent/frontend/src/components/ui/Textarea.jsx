import { forwardRef } from 'react'

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    className = '',
    rows = 3,
    id,
    size = 'md',
    ...props
  },
  ref
) {
  const textareaId = id || props.name || undefined
  const isSm = size === 'sm'

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className={`${
            isSm ? 'mb-0.5 text-[10px]' : 'mb-1.5 text-xs'
          } block font-semibold uppercase tracking-wider text-slate-700`}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full border bg-white leading-relaxed text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 resize-none ${
          isSm
            ? 'rounded-lg px-2.5 py-1 text-xs h-11 sm:h-12'
            : 'rounded-xl px-4 py-3 text-sm'
        } ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-200/90 focus:border-blue-500 focus:ring-blue-100 hover:border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className={`${isSm ? 'mt-0.5 text-[10px]' : 'mt-1 text-xs'} text-rose-600`}>{error}</p>}
      {!error && helperText && <p className={`${isSm ? 'mt-0.5 text-[10px]' : 'mt-1 text-xs'} text-slate-500`}>{helperText}</p>}
    </div>
  )
})

export default Textarea
