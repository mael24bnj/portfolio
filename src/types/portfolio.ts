export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface Profile {
  name: string
  shortName: string
  tagline: string
  role: string
  specialization: string
  location: string
  yearsOfExperience: number
  bio: string
  avatarSvg: string
  social: SocialLink[]
}

export interface SkillCategory {
  name: string
  items: string[]
}

export interface Experience {
  company: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
}

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  stack: string[]
  role: string
  year: string
  link: string
  image: string
  highlight: boolean
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  avatarColor: string
}

export interface GalleryItem {
  id: string
  imageUrl: string
  altText: string
}

export interface PortfolioData {
  profile: Profile
  skills: {
    categories: SkillCategory[]
  }
  experience: Experience[]
  projects: Project[]
  testimonials: Testimonial[]
  gallery: GalleryItem[]
}
