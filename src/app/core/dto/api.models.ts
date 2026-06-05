export type Role = 'ADMIN' | 'EDITOR';
export type PostStatus = 'DRAFT' | 'PUBLISHED';
export type MessageStatus = 'NEW' | 'READ' | 'ARCHIVED';
export type ProjectTag = 'coming_soon' | 'in_progress' | 'completed';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  status: PostStatus;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  tag: ProjectTag | null;
  sortOrder: number;
  createdAt: string;
}

export interface Social {
  platform: string;
  link: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  imageUrl: string | null;
  socials: Social[] | null;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  testimony: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  phone: string | null;
  city: string | null;
  message: string;
  status: MessageStatus;
  createdAt: string;
}
