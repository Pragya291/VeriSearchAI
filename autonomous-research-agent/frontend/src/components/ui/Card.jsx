export function Card({
  children,
  className = '',
  hover = false,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] ${
        hover
          ? 'transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        {title && (
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
        )}
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  )
}

export default Card
