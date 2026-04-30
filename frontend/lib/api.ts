import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'FULL_STACK' | 'WEB_DEVELOPER' | 'UI_UX_DESIGNER' | 'DATA_SCIENTIST';
  price: number;
  tier: 'FREE' | 'PRO' | 'AGENCY';
  previewUrl?: string;
  imageUrl: string;
  techStack: string[];
  rating: number;
  ratingCount: number;
  downloads: number;
  featured: boolean;
  reviews?: Review[];
  hasPurchased?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string; image?: string };
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PRO' | 'AGENCY';
}

export const categoryLabels: Record<string, string> = {
  FULL_STACK: 'Full Stack / Java',
  WEB_DEVELOPER: 'Web Developer',
  UI_UX_DESIGNER: 'UI/UX Designer',
  DATA_SCIENTIST: 'Data Science / ML',
};

export const tierColors: Record<string, string> = {
  FREE: 'bg-ivory-200 text-taupe-600',
  PRO: 'bg-espresso-500 text-ivory-100',
  AGENCY: 'bg-ink text-ivory-100',
};

export const formatPrice = (price: number, tier: string): string => {
  if (tier === 'FREE' || price === 0) return 'Free';
  return `$${price}/mo`;
};
