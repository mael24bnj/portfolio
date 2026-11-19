import type { ProfileMode, Project, ProjectTag } from '@/types/portfolio'

export const TAG_LABELS: Record<ProjectTag, string> = {
  data: 'Data',
  dev_ia: 'Dev & IA',
  hybride: 'Hybride',
}

/** Un projet « hybride » apparaît dans l'onglet Data comme dans l'onglet Dev & IA. */
export function matchesTab(project: Project, tab: ProfileMode | 'tout'): boolean {
  return tab === 'tout' || project.tag === tab || project.tag === 'hybride'
}
