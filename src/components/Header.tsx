import { useEffect, useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Блог', href: '/' },
  { label: 'Витрина', href: '/showcase' },
  { label: 'Идеи / разработка', href: '/ideas' },
  { label: 'О студии', href: '/about' },
  { label: 'Контакты', href: '/#contacts' },
];

function getPath() {
  const path = window.location.pathname.replace(/\/$/, '');
  return path || '/';
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncPath = () => setCurrentPath(getPath());
    syncPath();
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const isActive = (href: string) => href === '/' ? currentPath === '/' || currentPath.startsWith('/post/') : href === currentPath;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-paper/95 backdrop-blur-md border-b border-line'
          : 'bg-paper/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[4.25rem] lg:h-[4.75rem]">
          <a href="/" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-taiga/35 text-taiga">
              <Leaf size={15} strokeWidth={1.5} />
            </span>
            <span className="font-serif text-[1.15rem] tracking-wide text-ink font-semibold transition-colors group-hover:text-taiga">
              Студия Тиха
            </span>
          </a>

          <a
            href="/login"
            className="hidden md:inline text-[0.68rem] uppercase tracking-label font-sans text-ink/55 hover:text-taiga transition-colors"
          >
            Войти в личный кабинет
          </a>

          <button
            className="md:hidden text-ink p-2 -mr-2"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <nav className="hidden md:block border-t border-line/70">
          <ul className="flex items-center justify-center gap-8 lg:gap-12 h-12">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`relative text-[0.68rem] uppercase tracking-label font-sans transition-colors duration-300 ${
                    isActive(item.href)
                      ? 'text-taiga font-semibold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-taiga'
                      : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-paper border-t border-line ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-5 py-4 gap-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className={`text-sm font-sans tracking-wide transition-colors ${
                isActive(item.href) ? 'text-taiga font-semibold' : 'text-ink/70 hover:text-taiga'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={closeMenu}
            className="text-sm font-sans text-ink/55 hover:text-taiga transition-colors pt-3 border-t border-line mt-1"
          >
            Войти в личный кабинет
          </a>
        </nav>
      </div>
    </header>
  );
}
