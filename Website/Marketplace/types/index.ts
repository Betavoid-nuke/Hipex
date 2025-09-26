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