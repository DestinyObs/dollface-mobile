export type TutorialDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  difficulty: TutorialDifficulty;
  category: TutorialCategory;
  tags: string[];
  steps: TutorialStep[];
  isSaved?: boolean;
  createdAt: string;
}

export interface TutorialStep {
  id: string;
  order: number;
  title: string;
  description: string;
  mediaUrl?: string;
  products: string[];
  tips: string[];
}

export interface TutorialCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}
