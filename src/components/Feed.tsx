import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import type { Post, PostPage } from '@/types';
import { fetchPage } from '@/api';

const categoryColors: Record<string, string> = {
  'Проект': 'text-taiga',
  'Идея': 'text-moss-dark',
  'Разработка': 'text-earth',
  'Исследование': 'text-taiga',
  'Запись': 'text-ink/50',
};

const aspectClass: Record<string, string> = {
  landscape: 'aspect-[16/7] sm:aspect-[16/6]',
  portrait: 'aspect-[16/7] sm:aspect-[16/6]',
  square: 'aspect-[16/7] sm:aspect-[16/6]',
};

export default function Feed() {
  const [pages, setPages] = useState<PostPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPage(1)
      .then((result) => {
        if (cancelled) return;
        setPages([result]);
        setHasNext(result.hasNext);
        pageRef.current = 1;
      })
      .catch(() => {
        if (!cancelled) setError('Не удалось загрузить записи. Попробуйте позже.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasNext) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    try {
      const result = await fetchPage(nextPage);
      setPages((prev) => [...prev, result]);
      setHasNext(result.hasNext);
      pageRef.current = nextPage;
    } catch {
      setError('Не удалось загрузить больше записей.');
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [hasNext]);

  // Infinite scroll
  useEffect(() => {
    if (loading || !hasNext) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '0px 0px 400px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, hasNext, loadMore]);

  const allPosts = pages.flatMap((p) => p.items);

  if (loading) {
    return (
      <section className="bg-linen-light py-16">
        <div className="mx-auto max-w-page px-6 lg:px-10">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-moss animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error && allPosts.length === 0) {
    return (
      <section className="bg-linen-light py-16">
        <div className="mx-auto max-w-page px-6 lg:px-10">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle className="w-8 h-8 text-earth mb-4" />
            <p className="text-ink/70 font-sans">{error}</p>
            <button
              onClick={() => {
                setError(null);
                pageRef.current = 0;
                setPages([]);
                setHasNext(true);
                loadMore();
              }}
              className="mt-6 text-sm font-sans tracking-wide-lg text-taiga border border-taiga/30 px-5 py-2.5 hover:bg-taiga hover:text-linen-light transition-all duration-300"
            >
              Повторить
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="ideas" className="bg-paper pt-14 pb-20 lg:pt-20 lg:pb-32">
      <div className="mx-auto max-w-page px-6 lg:px-10">
        {/* Section label */}
        <div className="mb-10 lg:mb-14">
          <p className="text-xs uppercase tracking-label text-moss-dark font-sans mb-3">
            Лента
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl text-ink leading-tight font-medium">
            Хроника студии
          </h2>
          <p className="mt-4 text-ink/60 text-base lg:text-lg font-sans font-light leading-relaxed max-w-xl">
            Записи, проекты и идеи — в порядке появления. Новое вверху, старое
            внизу.
          </p>
        </div>

        <div className="border-t border-line">
          {allPosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>

        {/* Sentinel + states */}
        <div ref={sentinelRef} className="h-px" />

        {loadingMore && (
          <div className="flex items-center justify-center mt-12">
            <Loader2 className="w-5 h-5 text-moss animate-spin" />
          </div>
        )}

        {!hasNext && allPosts.length > 0 && (
          <div className="mt-14 text-center border-t border-line pt-10">
            <p className="text-sm font-sans text-ink/40">
              Это весь архив на данный момент.
            </p>
          </div>
        )}

        {error && allPosts.length > 0 && (
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="text-sm font-sans text-earth mb-4">{error}</p>
            <button
              onClick={loadMore}
              className="text-sm font-sans tracking-wide-lg text-taiga border border-taiga/30 px-5 py-2.5 hover:bg-taiga hover:text-linen-light transition-all duration-300"
            >
              Повторить загрузку
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FeedCard({ post }: { post: Post }) {
  return (
    <a href={post.href} className="group block border-b border-line py-8 lg:py-12">
      <div className={`relative overflow-hidden bg-taiga-deep ${aspectClass[post.aspect]}`}>
        <img
          src={post.image}
          alt={post.imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-taiga-deep/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-12 sm:gap-6 lg:pt-6">
        <div className="sm:col-span-3 lg:col-span-2">
          <span className={`text-[0.65rem] uppercase tracking-label font-sans ${categoryColors[post.category]}`}>
            {post.category}
          </span>
          <p className="mt-2 text-xs font-sans text-ink/40">{post.dateLabel}</p>
        </div>
        <div className="sm:col-span-7 lg:col-span-8">
          <h3 className="font-serif text-2xl lg:text-3xl text-ink leading-tight font-medium group-hover:text-taiga transition-colors duration-300">
            {post.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm lg:text-base text-ink/60 font-sans font-light leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="sm:col-span-2 flex items-end justify-start sm:justify-end">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-label font-sans text-ink/40 group-hover:text-taiga transition-colors duration-300">
            Читать
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </a>
  );
}
