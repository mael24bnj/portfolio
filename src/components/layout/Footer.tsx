import { useProfile } from '@/hooks/usePortfolio'
import { NAV_ITEMS } from '@/lib/constants'

export function Footer() {
  const profile = useProfile()
  const year = new Date().getFullYear()

  const columns = [
    {
      title: 'Navigation',
      links: NAV_ITEMS.map((item) => ({ label: item.label, href: item.href })),
    },
    {
      title: 'Connexion',
      links: profile.social.map((s) => ({
        label: s.label,
        href: s.url,
      })),
    },
    {
      title: 'Localisation',
      links: [{ label: profile.location, href: '#' }],
    },
  ]

  return (
    <footer className="border-t border-border-subtle bg-bg-dark">
      <div className="section-container grid gap-10 py-16 md:grid-cols-3 md:gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-primary/80 transition-colors hover:text-text-primary"
                    {...(link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border-subtle">
        <div className="section-container flex flex-col items-center justify-between gap-2 py-6 text-xs text-text-muted md:flex-row">
          <span>
            © {year} {profile.name}
          </span>
          <span>{profile.role}</span>
        </div>
      </div>
    </footer>
  )
}
