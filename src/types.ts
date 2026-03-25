export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  longDescription?: string;
  media?: MediaItem[];
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Post {
  id: string;
  text: string;
  media: MediaItem[];
  date: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioData {
  headline: string;
  aboutMe: string;
  contact: ContactInfo;
  projects: Project[];
  posts: Post[];
  personalImages: string[];
  cv?: CVData;
  services?: Service[];
  brandHeadline?: string;
  brandAbout?: string;
  adminPassword?: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    dob: string;
    nic: string;
    nationality: string;
  };
  technicalSkills: { category: string; skills: string }[];
  professionalSkills: string[];
  experience: { 
    title: string; 
    period: string; 
    company: string; 
    location: string;
    bullets: string[];
  }[];
  education: { 
    degree: string; 
    period: string; 
    institution: string; 
    location?: string;
    details?: string;
    bullets?: string[];
  }[];
  memberships: { role: string; organization: string; period: string }[];
  interests: string[];
  languages: { name: string; level: number }[];
  references: { name: string; title: string; email: string; phone: string }[];
  cvProjects: { 
    title: string; 
    description: string; 
    bullets?: string[];
    achievements?: string; 
    tools?: string; 
    type?: string; 
    contribution?: string;
    subProjects?: { title: string; description: string }[];
  }[];
}

export type Language = 'EN' | 'SI';
export type Page = 'brand-home' | 'brand-services' | 'cv-maker' | 'home' | 'projects' | 'posts' | 'cv';

export interface Translations {
  nav: {
    brandHome: string;
    services: string;
    cvMaker: string;
    portfolio: string;
    home: string;
    expertise: string;
    projects: string;
    posts: string;
    contact: string;
    cv: string;
  };
  hero: {
    cta: string;
  };
  about: {
    title: string;
  };
  expertise: {
    title: string;
    subtitle: string;
    education: string;
    skills: string;
    uoc: string;
    degree: string;
    gpa: string;
    award: string;
    awardDesc: string;
    faculty: string;
    modules: string;
  };
  projects: {
    title: string;
    subtitle: string;
    addProject: string;
    delete: string;
  };
  posts: {
    title: string;
    subtitle: string;
    addPost: string;
    delete: string;
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  admin: {
    login: string;
    password: string;
    submit: string;
    dashboard: string;
    editHeadline: string;
    editAbout: string;
    editContact: string;
    save: string;
    newProject: string;
    newPost: string;
    manageGallery: string;
  };
}
