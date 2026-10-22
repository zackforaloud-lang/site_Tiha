import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Post } from '@/types';

const AUTO_ADVANCE_MS = 30_000;

interface Props {
  posts: Post[];
  loading: boolean;
}

export default function Slider({ posts, loading }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current;

  const goTo = useCallback((index: number) => {
    if (posts.length === 0) return;
    setCurrent((index + posts.length) % posts.length);
  }, [posts.length]);

  useEffect(() => {
    if (paused || prefersReduced || posts.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((index) => (index + 1) % posts.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, prefersReduced, posts.length]);

  if (loading) {
    return <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12"><div className="h-[clamp(22rem,56vh,42rem)] bg-taiga-deep/15 animate-pulse" /></div>;
  }

  if (posts.length === 0) return null;

  return (
    <section id="showcase" className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
      <div
        className="relative h-[clamp(22rem,56vh,42rem)] bg-taiga-deep overflow-hidden rounded-[0.9rem]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Избранные работы студии"
      >
        {posts.map((post, index) => (
          <a
            key={post.id}
            href={post.href}
            className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            aria-hidden={index !== current}
            aria-label={`${post.title}, ${post.dateLabel}`}
          >
            <img
              src={post.image}
              alt={post.imageAlt}
              className={`w-full h-full object-cover ${index === current && !prefersReduced ? 'animate-slow-zoom' : ''}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-taiga-deep/80 via-taiga-deep/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="px-6 sm:px-10 lg:px-14 pb-12 lg:pb-16 max-w-xl">
                <p className="text-[0.63rem] uppercase tracking-label text-linen/75 font-sans mb-2">
                  {post.category}
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-linen-light leading-[1.02] font-medium">
                  {post.title}
                </h1>
                <p className="text-linen/65 text-xs uppercase tracking-label font-sans mt-3">
                  {post.dateLabel}
                </p>
              </div>
            </div>
          </a>
        ))}

        <div className="absolute right-6 bottom-6 z-20 flex items-center gap-2">
          <button
            onClick={() => goTo(current - 1)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-linen/35 text-linen-light hover:bg-linen-light hover:text-ink transition-colors"
            aria-label="Предыдущий слайд"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-linen/35 text-linen-light hover:bg-linen-light hover:text-ink transition-colors"
            aria-label="Следующий слайд"
          >
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {posts.map((post, index) => (
            <button
              key={post.id}
              onClick={() => goTo(index)}
              className={`transition-all duration-300 ${index === current ? 'w-7 h-1.5 bg-linen-light' : 'w-1.5 h-1.5 bg-linen/45 hover:bg-linen/80'}`}
              aria-label={`Слайд ${index + 1}: ${post.title}`}
              aria-current={index === current}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
