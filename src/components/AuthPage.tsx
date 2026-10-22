import { FormEvent, useState } from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';

export default function AuthPage() {
  const { user, profile, loading, authError, signIn, signUp, bootstrapAdmin } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);
    const success = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password);
    if (success) setNotice(mode === 'sign-in' ? 'Вход выполнен.' : 'Аккаунт создан.');
    setSubmitting(false);
  };

  if (user && profile) {
    return (
      <section className="mx-auto max-w-page px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="max-w-xl border border-line bg-linen/35 p-7 sm:p-10">
          <Leaf size={18} className="text-taiga" />
          <p className="mt-6 text-[0.64rem] uppercase tracking-label font-sans text-moss-dark">Личный кабинет</p>
          <h1 className="mt-3 font-serif text-4xl text-ink">Ваш профиль</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/65 font-sans">{user.email}</p>
          <p className="mt-2 text-xs uppercase tracking-label text-ink/45 font-sans">Роль: {profile.role}</p>
          {profile.role === 'admin' && (
            <a href="/admin" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-label font-sans text-taiga hover:text-taiga-light">
              Открыть админ-панель <ArrowRight size={14} />
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-page px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        <div>
          <div className="flex items-center gap-3 text-[0.64rem] uppercase tracking-label font-sans text-moss-dark"><Leaf size={14} /> Личный кабинет</div>
          <h1 className="mt-5 font-serif text-5xl leading-none text-ink">Тихое место для своих проектов.</h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/60 font-sans">Войдите, чтобы управлять публикациями и материалами студии. Обычный пользователь видит только свой профиль.</p>
        </div>
        <form onSubmit={submit} className="border border-line bg-linen/35 p-6 sm:p-8">
          <div className="flex gap-5 border-b border-line pb-4">
            <button type="button" onClick={() => setMode('sign-in')} className={`text-xs uppercase tracking-label font-sans ${mode === 'sign-in' ? 'text-taiga' : 'text-ink/40'}`}>Войти</button>
            <button type="button" onClick={() => setMode('sign-up')} className={`text-xs uppercase tracking-label font-sans ${mode === 'sign-up' ? 'text-taiga' : 'text-ink/40'}`}>Создать аккаунт</button>
          </div>
          <label className="mt-6 block text-xs uppercase tracking-wide font-sans text-ink/55">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans text-ink outline-none focus:border-taiga" /></label>
          <label className="mt-5 block text-xs uppercase tracking-wide font-sans text-ink/55">Пароль<input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border-b border-line bg-transparent py-3 font-sans text-ink outline-none focus:border-taiga" /></label>
          {(authError || notice) && <p className={`mt-5 text-sm font-sans ${authError ? 'text-earth' : 'text-taiga'}`}>{authError ?? notice}</p>}
          <button type="submit" disabled={submitting || loading} className="mt-7 inline-flex items-center gap-2 bg-taiga px-5 py-3 text-xs uppercase tracking-label text-linen-light transition-colors hover:bg-taiga-light disabled:opacity-50">{submitting ? 'Подождите' : mode === 'sign-in' ? 'Войти' : 'Создать'} <ArrowRight size={14} /></button>
          <button type="button" onClick={async () => { const success = await bootstrapAdmin(); if (success) setNotice('Вы назначены первым администратором.'); }} className="mt-7 block text-left text-[0.64rem] leading-relaxed text-ink/45 underline-offset-4 hover:text-taiga hover:underline">
            Я первый владелец студии — назначить первый admin
          </button>
        </form>
      </div>
    </section>
  );
}
