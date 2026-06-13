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
    title: 'Backend',
    description:
      'Robust APIs, data pipelines, and server-side logic built for scale and reliability.',
  },
  {
    title: 'AI / LLM',
    description:
      'Fine-tuning, RAG systems, and intelligent automation powered by modern ML frameworks.',
  },
  {
    title: 'Frontend',
    description:
      'Interactive dashboards and data visualizations with React, D3, and responsive design.',
  },
  {
    title: 'Cloud',
    description:
      'Deployment, containerization, and cloud infrastructure on AWS and Docker.',
  },
] as const
