export type ProfileMode = 'dev_ia' | 'data'

export type LinkKind = 'github' | 'linkedin' | 'email'

export interface ProfileLink {
  kind: LinkKind
  label: string
  url: string
  display: string
}

export interface Profile {
  name: string
  handle: string
  photo: string
  search: string
  availability: string
  location: string
  mobility: string
  roles: Record<ProfileMode, string>
  summaries: Record<ProfileMode, string>
  qualities: Record<ProfileMode, string[]>
  links: ProfileLink[]
}

export interface EducationEntry {
  years: string
  title: string
  school?: string
  note?: string
  current?: boolean
}

export interface SkillGroup {
  domain: string
  items: string[]
}

export interface Project {
  id: string
  domain: ProfileMode
  file: string
  title: string
  context: string
  metric?: { value: string; label: string }
  points: string[]
  stack: string[]
  links?: { label: string; url: string }[]
}

export interface PortfolioData {
  profile: Profile
  education: EducationEntry[]
  skills: Record<ProfileMode, SkillGroup[]>
  projects: Project[]
}
