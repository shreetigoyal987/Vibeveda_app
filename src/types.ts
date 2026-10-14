export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: Priority;
  tags: string[];
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  tags: string[];
  updatedAt: number;
}

export interface StickyIdea {
  id: string;
  content: string;
  author: string;
  color: string;
  votes: number;
  category: string;
  createdAt: number;
}

export interface ProjectPromptTemplate {
  id: string;
  title: string;
  category: 'Productivity' | 'E-Commerce' | 'Design & Media' | 'Analytics' | 'Games & Tools';
  description: string;
  prompt: string;
  icon: string;
  tags: string[];
}
