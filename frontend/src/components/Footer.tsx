import { useLang } from '../context/LangContext';
import { Page } from '../types';

interface Props {
  onNavigate: (p: Page) => void;
}

export function Footer({ onNavigate }: Props) {
  const { t } = useLang();

  const go = (p: Page) => {
    onNavigate(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand-col">
          <div className="fb-name">
            <div className="fb-mark">A</div>
            <span>APS <span style={{ color: 'var(--gold)' }}>Wild Card</span></span>
          </div>
          <p>{t('fb-desc')}</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/apswaildcard" target="_blank" rel="noopener" className="soc-btn">
              <i className="ti ti-brand-instagram" /> @apswaildcard
            </a>
            <span className="soc-btn">
              <i className="ti ti-map-pin" /> {t('f-city')}
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('fc1-h')}</h4>
          <ul>
            <li><button onClick={() => go('home')}>{t('fc-home')}</button></li>
            <li><button onClick={() => go('catalog')}>{t('fc-cat')}</button></li>
            <li><button onClick={() => go('about')}>{t('fc-about')}</button></li>
            <li><button onClick={() => go('contact')}>{t('fc-contact')}</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('fc2-h')}</h4>
          <ul>
            <li><button onClick={() => go('catalog')}>Доска обрезная</button></li>
            <li><button onClick={() => go('catalog')}>Брус строительный</button></li>
            <li><button onClick={() => go('catalog')}>Рейка</button></li>
            <li><button onClick={() => go('catalog')}>Вагонка</button></li>
            <li><button onClick={() => go('catalog')}>Половая доска</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('fc3-h')}</h4>
          <ul>
            <li>
              <a href="tel:+998938260330">+998 93 826 03 30 — Антон</a>
            </li>
            <li>
              <a href="tel:+998940970003">+998 94 097 00 03 — Суннат</a>
            </li>
            <li style={{ marginTop: 8 }}>
              <a href="https://www.instagram.com/apswaildcard" target="_blank" rel="noopener">
                @apswaildcard
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copy">{t('f-copy')}</div>
        <div className="loc">{t('f-lic')}</div>
      </div>
    </footer>
  );
}
