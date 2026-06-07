import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { Lang, Page } from '../types';

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
}

export function Topbar({ currentPage, onNavigate }: Props) {
  const { lang, setLang, t } = useLang();
  const { isLight, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { key: Page; tKey: 'n-home' | 'n-catalog' | 'n-about' | 'n-contact' }[] = [
    { key: 'home', tKey: 'n-home' },
    { key: 'catalog', tKey: 'n-catalog' },
    { key: 'about', tKey: 'n-about' },
    { key: 'contact', tKey: 'n-contact' },
  ];

  const go = (p: Page) => {
    onNavigate(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="topbar">
        <div className="logo-wrap" onClick={() => go('home')}>
          <div className="logo-mark">A</div>
          <div className="logo-name">APS <span>Wild Card</span></div>
        </div>

        <nav>
          {navItems.map(({ key, tKey }) => (
            <button
              key={key}
              className={`nav-item${currentPage === key ? ' on' : ''}`}
              onClick={() => go(key)}
            >
              {t(tKey)}
            </button>
          ))}
        </nav>

        <div className="topbar-right">
          <div className="lang-switch">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="ru">RU</option>
            <option value="uz">UZ</option>
            <option value="en">EN</option>
          </select>
        </div>
          <button className="theme-btn" onClick={toggleTheme} aria-label="Тема">
            <i className={isLight ? 'ti ti-moon' : 'ti ti-sun'} />
          </button>
          <button
            className="burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            <i className="ti ti-menu-2" />
          </button>
        </div>
      </div>

      <div className={`mob-nav${menuOpen ? ' open' : ''}`}>
        {navItems.map(({ key, tKey }) => (
          <button
            key={key}
            className={`mob-nav-item${currentPage === key ? ' on' : ''}`}
            onClick={() => go(key)}
          >
            {t(tKey)}
          </button>
        ))}
      </div>
    </>
  );
}
