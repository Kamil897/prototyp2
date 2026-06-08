import { Product, Page } from '../types';
import { useLang } from '../context/LangContext';
import { CatalogCard } from '../components/CatalogCard';

interface Props {
  products: Product[];
  onNavigate: (p: Page) => void;
  onProductClick: (id: number) => void;
}

export function HomePage({ products, onNavigate, onProductClick }: Props) {
  const { t } = useLang();

  return (
    <div className="page">
      {/* HERO */}
      <div className="hero">
        <div className="hero-img" />
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-eye">{t('h-eye')}</div>
          <h1 dangerouslySetInnerHTML={{ __html: t('h-ttl') }} />
          <p className="hero-sub">{t('h-sub')}</p>
          <div className="hero-btns">
            <button className="btn-gold" onClick={() => onNavigate('catalog')}>{t('h-b1')}</button>
            <button className="btn-ghost" onClick={() => onNavigate('contact')}>{t('h-b2')}</button>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="metrics">
        <div className="metric">
          <div className="metric-n">2024</div>
          <div className="metric-l">{t('m1')}</div>
        </div>
        <div className="metric">
          <div className="metric-n">12<span style={{ fontSize: '1.4rem' }}>+</span></div>
          <div className="metric-l">{t('m2')}</div>
        </div>
        <div className="metric">
          <div className="metric-n">100<span style={{ fontSize: '1.4rem' }}>%</span></div>
          <div className="metric-l">{t('m3')}</div>
        </div>
        <div className="metric">
          <div className="metric-n">24<span style={{ fontSize: '1.4rem' }}>ч</span></div>
          <div className="metric-l">{t('m4')}</div>
        </div>
      </div>

      {/* PROMO */}
      <div className="promo">
        <div className="promo-item"><i className="ti ti-truck" /><span>{t('pr1')}</span></div>
        <div className="promo-item"><i className="ti ti-certificate" /><span>{t('pr2')}</span></div>
        <div className="promo-item"><i className="ti ti-building-factory-2" /><span>{t('pr3')}</span></div>
        <div className="promo-item"><i className="ti ti-clock" /><span>{t('pr4')}</span></div>
      </div>

      {/* FEATURED */}
      <div className="sec">
        <div className="sec-head">
          <div className="sec-tag">{t('s1t')}</div>
          <div className="sec-title" dangerouslySetInnerHTML={{ __html: t('s1h') }} />
          <div className="sec-rule" />
        </div>
        <div className="cat-grid">
          {products.slice(0, 6).map((p) => (
            <CatalogCard key={p.id} product={p} small onClick={onProductClick} />
          ))}
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn-ghost" onClick={() => onNavigate('catalog')}>{t('h-view-all')}</button>
        </div>
      </div>
    </div>
  );
}
