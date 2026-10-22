const footerLinks = [
  { label: 'Блог', href: '/' },
  { label: 'Витрина', href: '/showcase' },
  { label: 'Идеи / разработка', href: '/ideas' },
  { label: 'О студии', href: '/about' },
  { label: 'Контакты', href: '/#contacts' },
];

export default function Footer() {
  return (
    <footer id="contacts" className="bg-linen border-t border-line">
      <div className="mx-auto max-w-page px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-serif text-xl text-ink font-semibold tracking-wide-lg">
              Студия Тиха
            </p>
            <p className="mt-1.5 text-sm font-sans text-ink/50 tracking-wide">
              Создаю вещи. Сохраняю смыслы.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-sans text-ink/60 hover:text-taiga transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-5 border-t border-line">
          <p className="text-xs font-sans text-ink/40">
            © {new Date().getFullYear()} Студия Тиха. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
