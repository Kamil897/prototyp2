import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { submitOrder } from '../api/client';
import { Product } from '../types';

interface Props {
  products: Product[];
  preselectedProduct?: string;
}

export function ContactPage({ products, preselectedProduct = '' }: Props) {
  const { lang, t } = useLang();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    product: preselectedProduct,
    volume: '',
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const send = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      await submitOrder(form);
      setSubmitted(true);
    } catch {
      setError('Ошибка отправки. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="sec" style={{ paddingBottom: '1rem' }}>
        <div className="sec-head">
          <div className="sec-tag">{t('co-tag')}</div>
          <div className="sec-title" dangerouslySetInnerHTML={{ __html: t('co-title') }} />
          <div className="sec-rule" />
        </div>
      </div>

      <div className="contact-wrap">
        {/* LEFT: INFO */}
        <div className="contact-info">
          <div className="ci">
            <div className="ci-ico"><i className="ti ti-building" /></div>
            <div>
              <div className="ci-lbl">{t('cl1')}</div>
              <div className="ci-val">
                г. Ташкент, Мирзо-Улугбекский р-н,<br />
                Дархон МФЙ, Катта Дархон, проезд 3, 2а
              </div>
            </div>
          </div>

          <div className="ci">
            <div className="ci-ico"><i className="ti ti-map-pin" /></div>
            <div>
              <div className="ci-lbl">{t('cl2')}</div>
              <div className="ci-val">
                Ташкентская область, Назарбек,<br />
                ориентир: Тахта базар
              </div>
            </div>
          </div>

          <div className="ci">
            <div className="ci-ico"><i className="ti ti-phone" /></div>
            <div>
              <div className="ci-lbl">{t('cl-phone')}</div>
              <div className="ci-val">
                <a href="tel:+998938260330" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span>+998 93 826 03 30</span>
                  <span style={{ fontSize: 11, color: 'var(--txt3)' }}>— Антон</span>
                </a>
                <a href="tel:+998940970003" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>+998 94 097 00 03</span>
                  <span style={{ fontSize: 11, color: 'var(--txt3)' }}>— Суннат</span>
                </a>
              </div>
            </div>
          </div>

          <div className="ci">
            <div className="ci-ico"><i className="ti ti-brand-instagram" /></div>
            <div>
              <div className="ci-lbl">Instagram</div>
              <div className="ci-val">
                <a href="https://www.instagram.com/apswaildcard" target="_blank" rel="noopener" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
                  @apswaildcard
                </a>
              </div>
            </div>
          </div>

          <div className="ci">
            <div className="ci-ico"><i className="ti ti-clock" /></div>
            <div>
              <div className="ci-lbl">{t('cl-work')}</div>
              <div className="ci-val">{t('cl-hours')}</div>
            </div>
          </div>

          <div className="map-btns">
            <a
              href="https://yandex.uz/maps/?text=Ташкент+Мирзо-Улугбекский+Дархон+проезд+3"
              target="_blank" rel="noopener"
              className="map-area map-btn"
            >
              <i className="ti ti-map-2" />
              <span>{t('cl-map')}</span>
            </a>
            <a
              href="https://maps.google.com/maps?q=41.326876,69.142032&ll=41.326876,69.142032&z=16"
              target="_blank" rel="noopener"
              className="map-area map-btn"
            >
              <i className="ti ti-map-2" />
              <span>{t('cl-map2')}</span>
            </a>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="contact-form">
          <div className="form-h">{t('fh')}</div>

          <div className="fr2">
            <div>
              <label className="fl">{t('fl1')}</label>
              <input className="ff" placeholder="Алишер" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="fl">{t('fl2')}</label>
              <input className="ff" placeholder="+998 90 000 00 00" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <label className="fl">{t('fl3')}</label>
          <select className="ff" value={form.product} onChange={set('product')}>
            <option value="">—</option>
            {products.map((p) => (
              <option key={p.id} value={`${p.name.ru} ${p.size}`}>
                {p.name[lang] || p.name.ru} {p.size}
              </option>
            ))}
          </select>

          <label className="fl">{t('fl4')}</label>
          <input className="ff" placeholder="напр. 20 м³" value={form.volume} onChange={set('volume')} />

          <label className="fl">{t('fl5')}</label>
          <textarea className="ff" placeholder="Дополнительно..." value={form.comment} onChange={set('comment')} />

          <button
            className="btn-send"
            onClick={send}
            disabled={submitted || loading || !form.name.trim() || !form.phone.trim()}
          >
            {loading ? '...' : t('sbtn')}
          </button>

          {submitted && <div className="ok-msg">{t('ok')}</div>}
          {error && <div className="ok-msg" style={{ color: 'var(--gold3)' }}>{error}</div>}

          <p style={{ fontSize: 11, color: 'var(--txt3)', marginTop: 10, lineHeight: 1.7 }}>
            Также пишите нам в Instagram:{' '}
            <a href="https://www.instagram.com/apswaildcard" target="_blank" rel="noopener" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
              @apswaildcard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
