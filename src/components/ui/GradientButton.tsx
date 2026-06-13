import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type GradientButtonProps =
  | ({ as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'a'; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)

export function GradientButton({
  as = 'button',
  className = '',
  children,
  ...props
}: GradientButtonProps & { children: ReactNode }) {
  const classes = `inline-flex items-center justify-center rounded-full bg-accent-gradient px-6 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${className}`

  if (as === 'a') {
    const { href, ...rest } = props as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string
    }
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
