import { useState, useMemo } from 'react';
import { Product, CatFilter } from '../types';
import { useLang } from '../context/LangContext';
import { CatalogCard } from '../components/CatalogCard';
import { cats } from '../data/translations';

interface Props {
  products: Product[];
  onProductClick: (id: number) => void;
  preselectedProduct?: string;
}

export function CatalogPage({ products, onProductClick }: Props) {
  const { lang, t } = useLang();
  const [activeFilter, setActiveFilter] = useState<CatFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const catMatch = activeFilter === 'all' || p.cat === activeFilter;
      const name = (p.name[lang] || p.name.ru).toLowerCase();
      const searchMatch = !q || name.includes(q) || p.size.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [products, activeFilter, search, lang]);

  return (
    <div className="page">
      <div className="sec">
        <div className="sec-head">
          <div className="sec-tag">{t('c-tag')}</div>
          <div className="sec-title" dangerouslySetInnerHTML={{ __html: t('c-title') }} />
          <div className="sec-rule" />
        </div>

        <div className="cat-search-row">
          <input
            className="cat-search"
            placeholder={t('cat-search-ph')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="cat-count">
            {filtered.length} {lang === 'en' ? 'items' : lang === 'uz' ? 'ta' : 'позиций'}
          </span>
        </div>

        <div className="cat-filters">
          {Object.entries(cats).map(([key, labels]) => (
            <button
              key={key}
              className={`filter-btn${activeFilter === key ? ' on' : ''}`}
              onClick={() => setActiveFilter(key as CatFilter)}
            >
              {labels[lang]}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="cat-grid">
            {filtered.map((p) => (
              <CatalogCard key={p.id} product={p} onClick={onProductClick} />
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--txt3)', fontSize: 13 }}>
            {t('no-results')}
          </div>
        )}
      </div>
    </div>
  );
}
