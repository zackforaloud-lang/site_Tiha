import { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import type { Post } from '@/types';

interface Props {
  post: Post;
  onClose: () => void;
}

export default function PostDetail({ post, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] bg-taiga-deep/80 p-4 sm:p-8 lg:p-12" role="dialog" aria-modal="true" aria-label={post.title} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <article className="relative mx-auto flex h-full max-w-6xl flex-col overflow-y-auto bg-paper">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-taiga hover:text-linen-light transition-colors"
          aria-label="Закрыть публикацию"
        >
          <X size={17} />
        </button>
        <div className="grid min-h-full grid-cols-1 lg:grid-cols-2">
          <div className="min-h-[18rem] bg-taiga-deep lg:min-h-full">
            <img src={post.image} alt={post.imageAlt} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
            <p className="text-[0.65rem] uppercase tracking-label font-sans text-taiga mb-4">{post.category}</p>
            <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">{post.title}</h2>
            <p className="mt-4 text-xs uppercase tracking-label font-sans text-ink/45">{post.dateLabel}</p>
            <p className="mt-8 max-w-prose text-base leading-relaxed text-ink/70 font-sans">{post.excerpt}</p>
            <button type="button" onClick={onClose} className="mt-10 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-label font-sans text-taiga hover:text-taiga-light transition-colors">
              <ArrowLeft size={14} />
              Вернуться в ленту
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
