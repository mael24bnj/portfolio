export const NAV_ITEMS = [
  { label: 'ACCUEIL', href: '#home' },
  { label: 'À PROPOS', href: '#about' },
  { label: 'COMPÉTENCES', href: '#skills' },
  { label: 'PROJETS', href: '#projects' },
  { label: 'GALERIE', href: '#gallery' },
  { label: 'CONTACT', href: '#contact' },
] as const

export const SERVICES = [
  {
    title: 'Développement backend',
    description:
      'APIs robustes, pipelines de données et logique côté serveur conçus pour la scale et la fiabilité.',
  },
  {
    title: 'Intelligence artificielle / LLM',
    description:
      'Fine-tuning, systèmes RAG et automatisation intelligente propulsés par les frameworks ML modernes.',
  },
  {
    title: 'Développement frontend',
    description:
      'Tableaux de bord interactifs et visualisations de données avec React, D3 et design réactif.',
  },
  {
    title: 'Infrastructure cloud',
    description:
      'Déploiement, conteneurisation et infrastructure cloud sur AWS et Docker.',
  },
] as const
