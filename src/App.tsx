import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Slider from '@/components/Slider';
import Feed from '@/components/Feed';
import StudioRibbon from '@/components/StudioRibbon';
import Footer from '@/components/Footer';
import PostDetail from '@/components/PostDetail';
import AuthPage from '@/components/AuthPage';
import AdminPage from '@/components/AdminPage';
import { AboutPage, IdeasPage, ShowcasePage } from '@/components/StudioPages';
import { fetchAllPublished, fetchFeatured } from '@/api';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';
import { posts } from '@/data';

function getPath() {
  const path = window.location.pathname.replace(/\/$/, '');
  return path || '/';
}

function getPage(path: string) {
  if (path === '/showcase' || path === '/ideas' || path === '/about' || path === '/login' || path === '/account' || path === '/admin') return path.slice(1);
  return 'blog';
}

function getPostSlug(path: string) {
  return path.startsWith('/post/') ? path.slice('/post/'.length) : '';
}

function App() {
  const [page, setPage] = useState('blog');
  const [featured, setFeatured] = useState<Post[]>([]);
  const [catalog, setCatalog] = useState<Post[]>([]);
  const [sliderLoading, setSliderLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const syncPath = () => {
      const path = getPath();
      const slug = getPostSlug(path);
      setPage(getPage(path));
      setSelectedPost(posts.find((post) => post.slug === slug) ?? null);
    };

    syncPath();
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchFeatured(), fetchAllPublished()])
      .then(([featuredItems, catalogItems]) => {
        if (!cancelled) {
          setFeatured(featuredItems);
          setCatalog(catalogItems);
        }
      })
      .finally(() => {
        if (!cancelled) setSliderLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const pageKey = page === 'blog' ? 'home' : page;
    supabase.from('site_seo').select('title, description, og_image_url').eq('page_key', pageKey).maybeSingle().then(({ data }) => {
      if (cancelled || !data) return;
      document.title = data.title;
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (description) description.content = data.description;
      const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
      if (ogImage && data.og_image_url) ogImage.content = data.og_image_url;
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const closePost = () => {
    window.history.pushState({}, '', page === 'blog' ? '/' : `/${page}`);
    setSelectedPost(null);
  };

  const renderPage = () => {
    if (page === 'showcase') return <ShowcasePage featured={featured} catalog={catalog} loading={sliderLoading} />;
    if (page === 'ideas') return <IdeasPage featured={featured} catalog={catalog} loading={sliderLoading} />;
    if (page === 'about') return <AboutPage featured={featured} catalog={catalog} loading={sliderLoading} />;
    if (page === 'login' || page === 'account') return <AuthPage />;
    if (page === 'admin') return <AdminPage />;

    return (
      <>
        <Slider posts={featured} loading={sliderLoading} />
        <StudioRibbon posts={featured} />
        <Feed />
      </>
    );
  };

  return (
    <div id="top" className="min-h-screen max-w-[1440px] mx-auto bg-paper">
      <Header />
      <main className="pt-[4.25rem] md:pt-[7.75rem]">{renderPage()}</main>
      <Footer />
      {selectedPost && <PostDetail post={selectedPost} onClose={closePost} />}
    </div>
  );
}

export default App;
