import { useEffect } from 'react';
import { Product } from '../types';
import { useLang } from '../context/LangContext';

interface Props {
  product: Product | null;
  onClose: () => void;
  onOrder: () => void;
}

export function ProductModal({ product: p, onClose, onOrder }: Props) {
  const { lang, t } = useLang();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = p ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [p]);

  if (!p) return null;

  const name = p.name[lang] || p.name.ru;
  const desc = p.desc[lang] || p.desc.ru;
  const specs = p.specs[lang] || p.specs.ru;

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <i className="ti ti-x" />
        </button>

        {p.img ? (
          <img className="modal-img" src={p.img} alt={name} />
        ) : (
          <div className="modal-img-fallback">
            <div className={`grain ${p.cls}`} style={{ position: 'absolute', inset: 0 }} />
          </div>
        )}

        <div className="modal-title">{name}</div>
        <div className="modal-sz">{p.size} мм</div>
        <div className="modal-desc">{desc}</div>

        <div className="modal-specs">
          {Object.entries(specs).map(([k, v]) => (
            <div className="spec-row" key={k}>
              <span className="spec-k">{k}</span>
              <span className="spec-v">{v}</span>
            </div>
          ))}
        </div>

        <div className="modal-btns">
          <button className="btn-gold" onClick={onOrder}>{t('modal-order')}</button>
          <button className="btn-ghost" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>
  );
}
