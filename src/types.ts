export type PostCategory = 'Проект' | 'Идея' | 'Разработка' | 'Исследование' | 'Запись';

export type AspectRatio = 'landscape' | 'portrait' | 'square';

export interface Post {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  date: string;
  dateLabel: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  aspect: AspectRatio;
  featured: boolean;
  href: string;
}

export interface PostPage {
  items: Post[];
  page: number;
  hasNext: boolean;
}
