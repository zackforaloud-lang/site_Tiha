import { FormEvent, useEffect, useState } from 'react';
import { ImagePlus, LogOut, Save, Trash2, UploadCloud } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

interface ContentRow {
  id: string;
  content_type: 'blog' | 'project';
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  image_alt: string;
  category: string;
  published: boolean;
  sort_date: string;
}

interface MediaRow {
  id: string;
  file_path: string;
  public_url: string;
  alt_text: string;
  caption: string;
}

interface ContentForm {
  content_type: 'blog' | 'project';
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image_url: string;
  image_alt: string;
  category: string;
  published: boolean;
  sort_date: string;
}

const emptyForm: ContentForm = {
  content_type: 'blog',
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  image_url: '',
  image_alt: '',
  category: 'Запись',
  published: false,
  sort_date: new Date().toISOString().slice(0, 10),
};

export default function AdminPage() {
  const { user, profile, loading, signOut } = useAuth();
  const [content, setContent] = useState<ContentRow[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [seo, setSeo] = useState({ page_key: 'home', title: '', description: '', og_image_url: '' });
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mediaAlt, setMediaAlt] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAdminData = async () => {
    const [contentResult, mediaResult, seoResult] = await Promise.all([
      supabase.from('content_items').select('id, content_type, title, slug, excerpt, body, image_url, image_alt, category, published, sort_date').order('sort_date', { ascending: false }),
      supabase.from('media_assets').select('id, file_path, public_url, alt_text, caption').order('created_at', { ascending: false }),
      supabase.from('site_seo').select('page_key, title, description, og_image_url').eq('page_key', 'home').maybeSingle(),
    ]);
    const failed = contentResult.error || mediaResult.error || seoResult.error;
    if (failed) throw failed;
    setContent((contentResult.data ?? []) as ContentRow[]);
    setMedia((mediaResult.data ?? []) as MediaRow[]);
    if (seoResult.data) setSeo(seoResult.data);
  };

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    loadAdminData().catch(() => setError('Не удалось загрузить данные админ-панели.'));
  }, [profile?.role]);

  if (loading) return <div className="mx-auto max-w-page px-6 py-24 text-sm font-sans text-ink/50">Загрузка кабинета…</div>;
  if (!user) return <AccessMessage text="Для доступа к админ-панели войдите в личный кабинет." action={{ label: 'Войти', href: '/login' }} />;
  if (profile?.role !== 'admin') return <AccessMessage text="У этой учётной записи нет прав администратора." action={{ label: 'Вернуться в кабинет', href: '/account' }} />;

  const reset = () => {
    setForm(emptyForm);
    setSelectedId(null);
  };

  const saveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const payload = { ...form, image_url: form.image_url || null };
    const result = selectedId
      ? await supabase.from('content_items').update(payload).eq('id', selectedId)
      : await supabase.from('content_items').insert(payload);
    if (result.error) {
      setError(result.error.code === '23505' ? 'Такой адрес публикации уже используется.' : 'Не удалось сохранить публикацию.');
      return;
    }
    setMessage(form.published ? 'Публикация сохранена и опубликована.' : 'Черновик сохранён.');
    reset();
    await loadAdminData();
  };

  const editContent = (item: ContentRow) => {
    setSelectedId(item.id);
    setForm({ ...item, image_url: item.image_url ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeContent = async (id: string) => {
    setError(null);
    const result = await supabase.from('content_items').delete().eq('id', id);
    if (result.error) setError('Не удалось удалить публикацию.');
    else await loadAdminData();
  };

  const uploadMedia = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !user) return;
    setError(null);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
    const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
    const upload = await supabase.storage.from('studio-media').upload(path, file, { contentType: file.type, upsert: false });
    if (upload.error) {
      setError('Не удалось загрузить фотографию. Проверьте формат и размер файла.');
      return;
    }
    const { data: publicData } = supabase.storage.from('studio-media').getPublicUrl(path);
    const saved = await supabase.from('media_assets').insert({ file_path: path, public_url: publicData.publicUrl, alt_text: mediaAlt, caption: '' });
    if (saved.error) {
      setError('Фотография загружена, но её запись не сохранилась.');
      return;
    }
    setFile(null);
    setMediaAlt('');
    setMessage('Фотография добавлена в медиатеку.');
    await loadAdminData();
  };

  const removeMedia = async (item: MediaRow) => {
    setError(null);
    const storageResult = await supabase.storage.from('studio-media').remove([item.file_path]);
    if (storageResult.error) {
      setError('Не удалось удалить файл.');
      return;
    }
    const result = await supabase.from('media_assets').delete().eq('id', item.id);
    if (result.error) setError('Файл удалён, но запись медиатеки не обновилась.');
    else await loadAdminData();
  };

  const saveSeo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const result = await supabase.from('site_seo').upsert(seo, { onConflict: 'page_key' });
    if (result.error) setError('Не удалось сохранить SEO-настройки.');
    else setMessage('SEO-настройки сохранены.');
  };

  return (
    <section className="mx-auto max-w-page px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div><p className="text-[0.64rem] uppercase tracking-label font-sans text-moss-dark">Приватная зона</p><h1 className="mt-3 font-serif text-5xl text-ink">Админ-панель</h1><p className="mt-3 text-sm font-sans text-ink/55">Управление публикациями, фотографиями и SEO.</p></div>
        <button onClick={signOut} className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-sans text-ink/55 hover:text-earth"><LogOut size={14} /> Выйти</button>
      </div>
      {(message || error) && <p className={`mt-6 text-sm font-sans ${error ? 'text-earth' : 'text-taiga'}`}>{error ?? message}</p>}

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <div className="flex items-center justify-between"><h2 className="font-serif text-3xl text-ink">{selectedId ? 'Редактировать запись' : 'Новая запись'}</h2>{selectedId && <button onClick={reset} className="text-xs uppercase tracking-label text-ink/45">Отменить</button>}</div>
          <form onSubmit={saveContent} className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-3"><label className="text-xs uppercase tracking-wide text-ink/55">Тип<select value={form.content_type} onChange={(event) => setForm({ ...form, content_type: event.target.value as ContentForm['content_type'] })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans"><option value="blog">Блог</option><option value="project">Проект</option></select></label><label className="text-xs uppercase tracking-wide text-ink/55">Категория<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label></div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="text-xs uppercase tracking-wide text-ink/55">Заголовок<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label><label className="text-xs uppercase tracking-wide text-ink/55">Адрес записи<input required pattern="[a-z0-9-]+" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label></div>
            <label className="block text-xs uppercase tracking-wide text-ink/55">Короткое описание<textarea required rows={3} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className="mt-2 w-full resize-y border border-line bg-transparent p-3 font-sans" /></label>
            <label className="block text-xs uppercase tracking-wide text-ink/55">Текст записи<textarea rows={7} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="mt-2 w-full resize-y border border-line bg-transparent p-3 font-sans" /></label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="text-xs uppercase tracking-wide text-ink/55">Ссылка на фото<input value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label><label className="text-xs uppercase tracking-wide text-ink/55">Дата<input type="date" required value={form.sort_date} onChange={(event) => setForm({ ...form, sort_date: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label></div>
            <label className="flex items-center gap-3 text-sm font-sans text-ink/65"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Опубликовать сразу</label>
            <button type="submit" className="inline-flex items-center gap-2 bg-taiga px-5 py-3 text-xs uppercase tracking-label text-linen-light hover:bg-taiga-light"><Save size={14} /> Сохранить</button>
          </form>
        </div>

        <div><h2 className="font-serif text-3xl text-ink">Публикации</h2><div className="mt-6 divide-y divide-line border-t border-line">{content.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 py-4"><div><p className="font-serif text-xl text-ink">{item.title}</p><p className="mt-1 text-xs uppercase tracking-wide text-ink/45 font-sans">{item.content_type} · {item.published ? 'опубликовано' : 'черновик'}</p></div><div className="flex gap-3"><button onClick={() => editContent(item)} className="text-xs uppercase tracking-wide text-taiga">Изменить</button><button onClick={() => removeContent(item.id)} aria-label={`Удалить ${item.title}`} className="text-earth"><Trash2 size={15} /></button></div></div>)}</div></div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-line pt-12 lg:grid-cols-2">
        <div><h2 className="font-serif text-3xl text-ink">Медиатека</h2><form onSubmit={uploadMedia} className="mt-6 border border-dashed border-line p-6"><label className="flex cursor-pointer items-center gap-3 text-sm font-sans text-ink/65"><UploadCloud size={18} className="text-taiga" />{file ? file.name : 'Выбрать JPG, PNG или WebP'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" /></label><input required={Boolean(file)} value={mediaAlt} onChange={(event) => setMediaAlt(event.target.value)} placeholder="Описание фотографии для доступности" className="mt-5 w-full border-b border-line bg-transparent py-3 font-sans text-sm" /><button disabled={!file} type="submit" className="mt-5 inline-flex items-center gap-2 bg-taiga px-5 py-3 text-xs uppercase tracking-label text-linen-light disabled:opacity-40"><ImagePlus size={14} /> Добавить фото</button></form><div className="mt-6 grid grid-cols-2 gap-4">{media.map((item) => <div key={item.id} className="group relative"><img src={item.public_url} alt={item.alt_text} className="aspect-square w-full object-cover" /><button onClick={() => removeMedia(item)} aria-label={`Удалить ${item.alt_text}`} className="absolute right-2 top-2 hidden bg-paper/90 p-2 text-earth group-hover:block"><Trash2 size={14} /></button></div>)}</div></div>
        <form onSubmit={saveSeo}><h2 className="font-serif text-3xl text-ink">SEO-настройки</h2><div className="mt-6 space-y-5"><label className="block text-xs uppercase tracking-wide text-ink/55">Страница<select value={seo.page_key} onChange={(event) => setSeo({ ...seo, page_key: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans"><option value="home">Главная</option><option value="showcase">Витрина</option><option value="ideas">Идеи / разработка</option><option value="about">О студии</option></select></label><label className="block text-xs uppercase tracking-wide text-ink/55">Заголовок страницы<input required value={seo.title} onChange={(event) => setSeo({ ...seo, title: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label><label className="block text-xs uppercase tracking-wide text-ink/55">Описание<textarea rows={4} value={seo.description} onChange={(event) => setSeo({ ...seo, description: event.target.value })} className="mt-2 w-full border border-line bg-transparent p-3 font-sans" /></label><label className="block text-xs uppercase tracking-wide text-ink/55">OG image URL<input value={seo.og_image_url ?? ''} onChange={(event) => setSeo({ ...seo, og_image_url: event.target.value })} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans" /></label></div><button type="submit" className="mt-6 inline-flex items-center gap-2 border border-taiga px-5 py-3 text-xs uppercase tracking-label text-taiga hover:bg-taiga hover:text-linen-light"><Save size={14} /> Сохранить SEO</button></form>
      </div>
    </section>
  );
}

function AccessMessage({ text, action }: { text: string; action: { label: string; href: string } }) {
  return <section className="mx-auto max-w-page px-6 py-24"><p className="text-sm font-sans text-ink/65">{text}</p><a href={action.href} className="mt-5 inline-block text-xs uppercase tracking-label text-taiga">{action.label}</a></section>;
}
