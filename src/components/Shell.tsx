import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { setSoundEnabled, useSound } from '../lib/sound';

const links = [
  { to: '/', label: '发现', end: true },
  { to: '/collection', label: '图鉴', end: false },
];

export function Shell({ children }: { children: ReactNode }) {
  const sound = useSound();
  return (
    <div className="app">
      <a className="skip" href="#content">
        跳到内容
      </a>
      <header className="topbar">
        <NavLink to="/" className="mark" end>
          Word Root Atlas
        </NavLink>
        <nav className="segment nav-desktop" aria-label="主要">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className={sound ? 'sound on' : 'sound'}
          aria-pressed={sound}
          aria-label={sound ? '关闭音效' : '打开音效'}
          onClick={() => setSoundEnabled(!sound)}
        >
          <Speaker muted={!sound} />
        </button>
      </header>
      <main id="content" className="shell-main">
        {children}
      </main>
      <nav className="tabbar" aria-label="主要">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label === '发现' ? <SearchIcon /> : <DeckIcon />}
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function Speaker({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 10h3l4-3v10l-4-3H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {muted ? (
        <path d="M16 10l4 4M20 10l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path d="M16 9c1.2.8 1.8 1.8 1.8 3S17.2 14.2 16 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 15.5L19 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DeckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="8" y="3.5" width="11" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="4" y="6.5" width="11" height="15" rx="2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
