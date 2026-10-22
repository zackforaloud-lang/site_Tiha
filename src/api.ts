import type { Post, PostPage } from '@/types';
import { posts as fallbackPosts } from '@/data';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 6;

interface ContentRow {
  id: string;
  title: string;
  slug: string;
  content_type: 'blog' | 'project';
  category: string;
  sort_date: string;
  excerpt: string;
  image_url: string | null;
  image_alt: string;
}

function toPost(item: ContentRow): Post {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category as Post['category'],
    date: item.sort_date,
    dateLabel: new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${item.sort_date}T12:00:00`)),
    excerpt: item.excerpt,
    image: item.image_url ?? '',
    imageAlt: item.image_alt,
    aspect: 'landscape',
    featured: false,
    href: `/post/${item.slug}`,
  };
}

async function fetchPublishedContent() {
  const { data, error } = await supabase
    .from('content_items')
    .select('id, title, slug, content_type, category, sort_date, excerpt, image_url, image_alt')
    .eq('published', true)
    .order('sort_date', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContentRow[];
}

export async function fetchAllPublished(): Promise<Post[]> {
  try {
    const items = await fetchPublishedContent();
    if (items.length > 0) return items.map(toPost);
  } catch (error) {
    console.error('published content load failed', error);
  }

  return [...fallbackPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export async function fetchFeatured(): Promise<Post[]> {
  const items = await fetchAllPublished();
  const databaseItems = items.filter((post) => post.id !== fallbackPosts.find((fallback) => fallback.slug === post.slug)?.id);
  if (databaseItems.length > 0) return databaseItems.slice(0, 4);
  return items.filter((post) => post.featured).slice(0, 4);
}

export async function fetchPage(page: number): Promise<PostPage> {
  try {
    const items = await fetchPublishedContent();
    if (items.length > 0) {
      const start = (page - 1) * PAGE_SIZE;
      return {
        items: items.slice(start, start + PAGE_SIZE).map(toPost),
        page,
        hasNext: start + PAGE_SIZE < items.length,
      };
    }
  } catch (error) {
    console.error('content page load failed', error);
  }

  const sorted = [...fallbackPosts].sort((a, b) => b.date.localeCompare(a.date));
  const start = (page - 1) * PAGE_SIZE;
  return { items: sorted.slice(start, start + PAGE_SIZE), page, hasNext: start + PAGE_SIZE < sorted.length };
}
