import { Code2, Link2, Mail } from 'lucide-react'
import type { SocialLink } from '@/types/portfolio'

const ICONS: Record<string, typeof Mail> = {
  github: Code2,
  linkedin: Link2,
  email: Mail,
}

interface SocialPillsProps {
  links: SocialLink[]
  className?: string
}

export function SocialPills({ links, className = '' }: SocialPillsProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = ICONS[link.platform] ?? Mail
        return (
          <a
            key={link.platform}
            href={link.url}
            target={link.platform === 'email' ? undefined : '_blank'}
            rel={link.platform === 'email' ? undefined : 'noopener noreferrer'}
            className="card-dark flex items-center gap-2 border px-4 py-2 text-sm text-text-muted transition-colors duration-300 hover:border-text-muted hover:text-text-primary"
          >
            <Icon size={16} />
            {link.label}
          </a>
        )
      })}
    </div>
  )
}
