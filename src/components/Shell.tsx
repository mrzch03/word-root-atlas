import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useCollection } from '../lib/collection';

const links = [
  { to: '/', label: '发现', end: true },
  { to: '/tree', label: '词根之树', end: false },
  { to: '/collection', label: '图鉴', end: false },
];

export function Shell({ children }: { children: ReactNode }) {
  const bag = useCollection();
  return (
    <div className="app">
      <a className="skip" href="#content">
        跳到内容
      </a>
      <header className="topbar">
        <NavLink to="/" className="mark" end>
          <span className="mark-zh">词根图鉴</span>
          <span className="mark-en">Word Root Atlas</span>
        </NavLink>
        <nav className="nav-desktop" aria-label="主要">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <p className="count" aria-live="polite">
          {bag.count === 0 ? '图鉴是空的' : `${bag.count} 词 · ${bag.rootCount} 根`}
        </p>
      </header>
      <main id="content" className="shell-main">
        {children}
      </main>
      <nav className="tabbar" aria-label="主要">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
