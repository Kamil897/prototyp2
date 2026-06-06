import { useLang } from '../context/LangContext';

export function AboutPage() {
  const { t } = useLang();

  return (
    <div className="page">
      <div className="sec" style={{ paddingBottom: '1rem' }}>
        <div className="sec-head">
          <div className="sec-tag">{t('a-tag')}</div>
          <div className="sec-title" dangerouslySetInnerHTML={{ __html: t('a-title') }} />
          <div className="sec-rule" />
        </div>
      </div>

      <div className="about-wrap">
        <div className="about-nums">
          <div className="ab-cell"><div className="ab-n">2024</div><div className="ab-l">{t('a1')}</div></div>
          <div className="ab-cell"><div className="ab-n">UZ</div><div className="ab-l">{t('a2')}</div></div>
          <div className="ab-cell"><div className="ab-n">RU</div><div className="ab-l">{t('a3')}</div></div>
          <div className="ab-cell"><div className="ab-n">B2B</div><div className="ab-l">{t('a4')}</div></div>
        </div>
        <div className="about-body">
          <p>{t('ap1')}</p>
          <p>{t('ap2')}</p>
          <ul className="feat">
            {(['f1','f2','f3','f4','f5'] as const).map((k) => (
              <li key={k}>
                <i className="ti ti-arrow-right" />
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="about-gallery">
        <div className="about-gal-img">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75" alt="Склад пиломатериалов" loading="lazy" />
        </div>
        <div className="about-gal-img">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75" alt="Строительные материалы" loading="lazy" />
        </div>
        <div className="about-gal-img">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=75" alt="Лесозаготовка" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
