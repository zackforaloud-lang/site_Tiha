import { ArrowRight, Leaf } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Post } from '@/types';
import Slider from '@/components/Slider';

interface PageProps {
  featured: Post[];
  catalog: Post[];
  loading: boolean;
}

export function ShowcasePage({ featured, catalog, loading }: PageProps) {
  const projects = catalog.filter((post) => post.category === 'Проект');

  return (
    <PageFrame eyebrow="Витрина" title="Вещи, которые уже существуют" intro="Предметы, детали и материалы, собранные в мастерской. Каждая работа — отдельный разговор о форме, дереве и времени.">
      <Slider posts={featured} loading={loading} />
      <div className="mx-auto max-w-page px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((post) => (
            <a key={post.id} href={post.href} className="group">
              <div className="aspect-square overflow-hidden rounded-lg bg-taiga-deep">
                <img src={post.image} alt={post.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-4">
                <h2 className="font-serif text-2xl leading-tight text-ink group-hover:text-taiga transition-colors">{post.title}</h2>
                <span className="shrink-0 text-[0.62rem] uppercase tracking-label font-sans text-ink/45">{post.dateLabel}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/60 font-sans">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-[0.64rem] uppercase tracking-label text-taiga font-sans">
                Подробнее <ArrowRight size={13} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}

export function IdeasPage({ catalog, loading }: PageProps) {
  const ideas = catalog.filter((post) => post.category === 'Идея' || post.category === 'Разработка');

  return (
    <PageFrame eyebrow="Идеи / разработка" title="То, что ещё обретает форму" intro="Концепции, рабочие заметки и поиски материала. Здесь идеи остаются живыми — от первого наброска до первого предмета.">
      <Slider posts={ideas.slice(0, 4)} loading={loading} />
      <div className="mx-auto max-w-page px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="border-t border-line">
          {ideas.map((post) => (
            <a key={post.id} href={post.href} className="group grid grid-cols-1 gap-4 border-b border-line py-8 sm:grid-cols-12 sm:gap-6 lg:py-10">
              <div className="sm:col-span-3 lg:col-span-2">
                <span className="text-[0.64rem] uppercase tracking-label font-sans text-earth">{post.category}</span>
                <p className="mt-2 text-xs font-sans text-ink/40">{post.dateLabel}</p>
              </div>
              <div className="sm:col-span-7 lg:col-span-8">
                <h2 className="font-serif text-2xl leading-tight text-ink group-hover:text-taiga transition-colors lg:text-3xl">{post.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60 font-sans lg:text-base">{post.excerpt}</p>
              </div>
              <div className="flex items-end sm:col-span-2 sm:justify-end">
                <ArrowRight size={17} className="text-ink/35 transition-all group-hover:translate-x-1 group-hover:text-taiga" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}

export function AboutPage({ featured, loading }: PageProps) {
  const aboutRows = [
    {
      title: 'Внимание к найденной форме',
      text: 'Я начинаю не с готового ответа, а с наблюдения. Смотрю на старые детали, записываю пропорции, изучаю орнаменты и следы ручного труда — чтобы понять, что в них продолжает работать сегодня.',
      image: 'https://images.pexels.com/photos/7821174/pexels-photo-7821174.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
      alt: 'Старинный деревянный фасад с резными деталями',
      reverse: false,
    },
    {
      title: 'Материал задаёт разговор',
      text: 'Дерево не бывает нейтральным. Порода, волокно, плотность и возраст влияют на форму, поэтому каждый проект начинается с выбора материала и разговора о том, каким он должен остаться после работы.',
      image: 'https://images.pexels.com/photos/8961539/pexels-photo-8961539.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
      alt: 'Мастер работает стамеской по дереву',
      reverse: true,
    },
    {
      title: 'От эскиза к вещи',
      text: 'В работе есть место эксперименту: первый макет может оказаться слишком тихим, а случайная линия — стать главным мотивом. Я показываю промежуточные шаги и оставляю время на то, чтобы форма стала точной.',
      image: 'https://images.pexels.com/photos/29537620/pexels-photo-29537620.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200',
      alt: 'Рабочий стол с инструментами в мастерской',
      reverse: false,
    },
    {
      title: 'Вещь должна продолжать жизнь',
      text: 'Готовый предмет не заканчивает проект. Важно, чтобы он был понятен своему человеку, выдерживал ежедневное использование и со временем становился частью пространства, а не просто красивым изображением.',
      image: 'https://images.pexels.com/photos/15209817/pexels-photo-15209817.jpeg?auto=compress&cs=tinysrgb&h=900&w=1000',
      alt: 'Ручная деревянная чаша с живой текстурой',
      reverse: true,
    },
  ];

  return (
    <PageFrame eyebrow="О студии" title="Исследую прошлое. Создаю настоящее." intro="Студия Тиха — авторская мастерская для вещей, в которых традиционные формы получают новое продолжение.">
      <Slider posts={featured} loading={loading} />
      <div className="mx-auto max-w-page px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="space-y-16 lg:space-y-24">
          {aboutRows.map((row) => (
            <article key={row.title} className={`grid grid-cols-1 items-center gap-8 sm:grid-cols-12 lg:gap-12 ${row.reverse ? 'sm:[direction:rtl]' : ''}`}>
              <div className={`sm:col-span-3 ${row.reverse ? 'sm:[direction:ltr]' : ''}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-taiga-deep">
                  <img src={row.image} alt={row.alt} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={`sm:col-span-9 ${row.reverse ? 'sm:[direction:ltr]' : ''}`}>
                <p className="mb-4 text-[0.64rem] uppercase tracking-label font-sans text-moss-dark">Студия Тиха</p>
                <h2 className="max-w-xl font-serif text-3xl leading-tight text-ink lg:text-4xl">{row.title}</h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 font-sans lg:text-lg">{row.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="pb-8 sm:px-8 lg:px-12 lg:pb-12">
        <Slider posts={[...featured].reverse()} loading={loading} />
      </div>
    </PageFrame>
  );
}

function PageFrame({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div>
      <div className="mx-auto max-w-page px-5 pb-10 pt-10 sm:px-8 lg:px-12 lg:pb-14 lg:pt-14">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3 text-[0.64rem] uppercase tracking-label font-sans text-moss-dark">
            <Leaf size={14} strokeWidth={1.5} /> {eyebrow}
          </div>
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60 font-sans lg:text-lg">{intro}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
