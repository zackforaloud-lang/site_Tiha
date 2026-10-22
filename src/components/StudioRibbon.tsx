import { ArrowRight, Leaf } from 'lucide-react';
import type { Post } from '@/types';

interface Props {
  posts: Post[];
}

export default function StudioRibbon({ posts }: Props) {
  return (
    <section id="about" className="mx-auto max-w-page px-5 sm:px-8 lg:px-12 pt-8 lg:pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
        <div className="lg:col-span-8 grid grid-cols-3 gap-3 sm:gap-5">
          {posts.slice(0, 3).map((post, index) => (
            <a key={post.id} href={post.href} className="group min-w-0">
              <div className="relative overflow-hidden rounded-lg aspect-[1.25/1] bg-taiga-deep">
                <img src={post.image} alt={post.imageAlt} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-taiga-deep/70 to-transparent" />
                <span className="absolute left-3 bottom-3 text-[0.58rem] text-linen-light font-sans tracking-label uppercase">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-2 text-[0.66rem] uppercase tracking-wide font-sans text-ink/55 truncate">
                {post.title}
              </p>
            </a>
          ))}
        </div>
        <div className="lg:col-span-4 bg-sage/25 rounded-lg px-6 py-6 lg:px-7 flex flex-col justify-between">
          <div>
            <Leaf size={16} className="text-taiga mb-3" strokeWidth={1.5} />
            <p className="font-serif text-2xl lg:text-[1.7rem] leading-tight text-ink">
              Вещи, идеи и следы работы.
            </p>
            <p className="text-sm leading-relaxed text-ink/60 font-sans mt-3">
              Небольшая мастерская, где найденные формы становятся современными предметами.
            </p>
          </div>
          <a href="#ideas" className="group inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-label font-sans text-taiga mt-6">
            О студии
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
