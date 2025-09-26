// types/index.ts
export interface Product {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  image: string;
  category: string;
}

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  isAnimated: boolean;
  isDownloadable: boolean;
  date: Date;
  likes: number;
  isFavorite: boolean;
  rating?: number;
  reviews?: number;
  technicalInfo?: { label: string; value: string }[];
  downloadFormats?: { format: string; size: string; downloadUrl: string }[];
  comments?: { user: string; comment: string; date: Date }[];
  photos?: string[];
}

export interface cart{
  product: Product;
}


export interface TechnicalInfo {
  label: string;
  value: string;
}

export interface Comment {
  user: string; comment: string; date: Date
}

export interface DownloadFormat {
  format: string;
  size: string;
  downloadUrl: string;
}

export interface Twin {
  id: string;
  title: string;
  description: string;
  author: string;
  rating: number;
  reviews: number;
  category: string;
  photos: string[];
  technicalInfo: TechnicalInfo[];
  comments: Comment[];
  downloadFormats?: DownloadFormat[];
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  id: string;
}

export type Asset = {
  id: string;
  title: string;
  description: string;
  photos: string[];
  technicalInfo: TechnicalInfo[];
  downloadFormats: DownloadFormat[];
  modelFile: File | null;
};