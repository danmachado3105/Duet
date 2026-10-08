export default function Button({
  href = '#',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}