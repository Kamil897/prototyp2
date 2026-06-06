import { Product } from '../types';
import { useLang } from '../context/LangContext';

interface Props {
  product: Product;
  small?: boolean;
  onClick: (id: number) => void;
}

export function CatalogCard({ product: p, small = false, onClick }: Props) {
  const { lang, t } = useLang();
  const name = p.name[lang] || p.name.ru;
  const desc = p.desc[lang] || p.desc.ru;
  const tags = p.tags[lang] || p.tags.ru;
  const shortDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;

  return (
    <div className="cat-card" onClick={() => onClick(p.id)}>
      <div className="card-img">
        {p.img ? (
          <>
            <span className="card-badge-top">{tags[0]}</span>
            <img
              src={p.img}
              alt={`${name} ${p.size}`}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
              }}
            />
            <div className="wood-lbl">{p.size} мм</div>
          </>
        ) : (
          <>
            <div className="card-img-fallback">
              <div className={`grain ${p.cls}`} style={{ position: 'absolute', inset: 0 }} />
            </div>
            <span className="card-badge-top">{tags[0]}</span>
            <div className="wood-lbl">{p.size} мм</div>
          </>
        )}
      </div>
      <div className="card-body">
        <div className="cat-name">{name}</div>
        <div className="cat-sz">{p.size} мм</div>
        {!small && <div className="cat-desc">{shortDesc}</div>}
        <div className="badges">
          {tags.map((tag, i) => (
            <span key={i} className={`badge${i === 0 ? ' g' : ''}`}>{tag}</span>
          ))}
        </div>
        <div className="card-footer">
          <span className="card-price">{t('price-on-request')}</span>
          <button className="card-cta">{t('details')}</button>
        </div>
      </div>
    </div>
  );
}
