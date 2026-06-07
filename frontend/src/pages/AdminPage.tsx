import { useState, useCallback } from 'react';
import {
  adminFetchProducts, adminFetchOrders,
  adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminUpdateOrderStatus, adminDeleteOrder,
} from '../api/client';

// ── Types ──────────────────────────────────────────────────
interface AdminProduct {
  id: number; nameRu: string; nameUz: string; nameEn: string;
  size: string; cat: string; cls: string; img: string; price: string;
  tagsRu: string; tagsUz: string; tagsEn: string;
  descRu: string; descUz: string; descEn: string;
  specsRu: string; specsUz: string; specsEn: string;
  active: boolean; position: number;
}
interface Order {
  id: string; name: string; phone: string; product: string;
  volume: string; comment: string; status: string; createdAt: string;
}
type SpecPair = { key: string; value: string };

const EMPTY: Omit<AdminProduct, 'id'> = {
  nameRu: '', nameUz: '', nameEn: '', size: '', cat: 'board', cls: 'g1',
  img: '', price: '', tagsRu: '[]', tagsUz: '[]', tagsEn: '[]',
  descRu: '', descUz: '', descEn: '',
  specsRu: '{}', specsUz: '{}', specsEn: '{}',
  active: true, position: 0,
};

const CAT_OPTIONS = ['board', 'beam', 'batten', 'finishing'];
const STATUS_COLORS: Record<string, string> = {
  new: '#C9974A', processing: '#4A90C9', done: '#4AC974',
};

// ── Helpers ────────────────────────────────────────────────
function parseTags(s: string): string[] {
  try { return JSON.parse(s); } catch { return []; }
}
function parseSpecs(s: string): SpecPair[] {
  try {
    const obj = JSON.parse(s);
    return Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
  } catch { return []; }
}
function specsToJson(pairs: SpecPair[]): string {
  const obj: Record<string, string> = {};
  pairs.filter(p => p.key.trim()).forEach(p => { obj[p.key.trim()] = p.value; });
  return JSON.stringify(obj);
}
function exportCSV(orders: Order[]) {
  const header = 'ID,Имя,Телефон,Товар,Объём,Комментарий,Статус,Дата';
  const rows = orders.map(o =>
    [o.id, o.name, o.phone, o.product, o.volume, o.comment, o.status,
      new Date(o.createdAt).toLocaleString('ru-RU')]
      .map(v => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click();
}

// ── TagEditor ─────────────────────────────────────────────
function TagEditor({ label, value, onChange }: {
  label: string; value: string;
  onChange: (v: string) => void;
}) {
  const [input, setInput] = useState('');
  const tags = parseTags(value);
  const add = () => {
    const t = input.trim();
    if (!t || tags.includes(t)) return;
    onChange(JSON.stringify([...tags, t]));
    setInput('');
  };
  const remove = (i: number) => onChange(JSON.stringify(tags.filter((_, idx) => idx !== i)));
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 5 }}>
        {tags.map((t, i) => (
          <span key={i} style={s.chip}>
            {t}
            <button onClick={() => remove(i)} style={s.chipX}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input style={{ ...s.input, flex: 1, marginBottom: 0 }} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Введите тег, Enter" />
        <button style={s.btnSmall} onClick={add}>+</button>
      </div>
    </div>
  );
}

// ── SpecEditor ────────────────────────────────────────────
function SpecEditor({ label, value, onChange }: {
  label: string; value: string;
  onChange: (v: string) => void;
}) {
  const pairs = parseSpecs(value);
  const update = (idx: number, k: 'key' | 'value', v: string) => {
    const next = pairs.map((p, i) => i === idx ? { ...p, [k]: v } : p);
    onChange(specsToJson(next));
  };
  const add = () => onChange(specsToJson([...pairs, { key: '', value: '' }]));
  const remove = (idx: number) => onChange(specsToJson(pairs.filter((_, i) => i !== idx)));
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
          <input style={{ ...s.input, flex: 1, marginBottom: 0 }} value={p.key}
            onChange={e => update(i, 'key', e.target.value)} placeholder="Ключ" />
          <input style={{ ...s.input, flex: 2, marginBottom: 0 }} value={p.value}
            onChange={e => update(i, 'value', e.target.value)} placeholder="Значение" />
          <button style={{ ...s.btnSmall, borderColor: '#c44' }} onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button style={s.btnSmall} onClick={add}>+ Строка</button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<AdminProduct, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  // Orders filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'new' | 'processing' | 'done'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  const load = useCallback(async (pwd: string) => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        adminFetchProducts(pwd), adminFetchOrders(pwd),
      ]);
      setProducts(prods); setOrders(ords); setAuthed(true);
    } catch (e: any) {
      setAuthError(e.message === 'wrong_password' ? 'Неверный пароль' : 'Ошибка подключения');
    } finally { setLoading(false); }
  }, []);

  const login = () => { setAuthError(''); load(password); };

  const openNew = () => { setEditProduct(null); setFormData(EMPTY); setShowForm(true); };
  const openEdit = (p: AdminProduct) => { setEditProduct(p); setFormData({ ...p }); setShowForm(true); };

  const set = (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      if (editProduct) await adminUpdateProduct(password, editProduct.id, formData);
      else await adminCreateProduct(password, formData);
      setShowForm(false); setMsg('✓ Сохранено'); await load(password);
    } catch { setMsg('Ошибка сохранения'); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await adminDeleteProduct(password, id); await load(password);
  };

  const toggleActive = async (p: AdminProduct) => {
    await adminUpdateProduct(password, p.id, { ...p, active: !p.active });
    await load(password);
  };

  const changeStatus = async (id: string, status: string) => {
    await adminUpdateOrderStatus(password, id, status); await load(password);
  };

  const delOrder = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    await adminDeleteOrder(password, id); await load(password);
  };

  // ── Filtered orders ──────────────────────────────────────
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderFilter === 'all' || o.status === orderFilter;
    const q = orderSearch.toLowerCase();
    const matchSearch = !q || o.name.toLowerCase().includes(q) || o.phone.includes(q);
    return matchStatus && matchSearch;
  });

  const newToday = orders.filter(o => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // ── Login ────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={s.logoMark}>A</div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}>
              APS <span style={{ color: 'var(--gold)' }}>Admin</span>
            </span>
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--txt)', marginBottom: 12 }}>Панель управления</div>
          <input style={s.input} type="password" placeholder="Пароль администратора"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()} />
          {authError && <div style={{ color: '#e05555', fontSize: 12 }}>{authError}</div>}
          <button style={s.btnGold} onClick={login} disabled={loading}>
            {loading ? 'Подключение...' : 'Войти'}
          </button>
        </div>
      </div>
    );
  }

  // ── Admin UI ─────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      {/* HEADER */}
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={s.logoMark}>A</div>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18 }}>
            APS <span style={{ color: 'var(--gold)' }}>Admin</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['dashboard', 'products', 'orders'] as const).map(t => (
            <button key={t} style={tab === t ? s.tabOn : s.tab} onClick={() => setTab(t)}>
              {t === 'dashboard' ? '📊 Дашборд' : t === 'products' ? `📦 Товары (${products.length})` : `📋 Заявки (${orders.filter(o => o.status === 'new').length} новых)`}
            </button>
          ))}
        </div>
        <button style={s.btnGhost} onClick={() => setAuthed(false)}>Выйти</button>
      </div>

      {msg && <div style={s.msgBar}>{msg}</div>}

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div style={s.content}>
          <div style={s.sectionTitle}>Дашборд</div>

          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={s.statNum}>{orders.length}</div>
              <div style={s.statLbl}>Всего заявок</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statNum, color: '#C9974A' }}>{orders.filter(o => o.status === 'new').length}</div>
              <div style={s.statLbl}>Новых</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statNum, color: '#4A90C9' }}>{orders.filter(o => o.status === 'processing').length}</div>
              <div style={s.statLbl}>В работе</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statNum, color: '#4AC974' }}>{newToday}</div>
              <div style={s.statLbl}>Сегодня</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNum}>{products.length}</div>
              <div style={s.statLbl}>Товаров</div>
            </div>
          </div>

          {/* Last 5 orders */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ ...s.sectionTitle, fontSize: '1.1rem', marginBottom: 12 }}>Последние заявки</div>
            {orders.slice(0, 5).map(o => (
              <div key={o.id} style={s.orderCard}>
                <div style={s.orderTop}>
                  <div>
                    <div style={s.orderName}>{o.name}</div>
                    <a href={`tel:${o.phone}`} style={s.orderPhone}>{o.phone}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...s.statusBadge, background: STATUS_COLORS[o.status] || '#666' }}>{o.status}</span>
                    <span style={{ fontSize: 11, color: 'var(--txt3)' }}>{new Date(o.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                {o.product && <div style={{ fontSize: 12, color: 'var(--txt2)', marginTop: 4 }}>{o.product} {o.volume && `· ${o.volume}`}</div>}
              </div>
            ))}
            {orders.length === 0 && <div style={{ color: 'var(--txt3)', fontSize: 13 }}>Заявок пока нет</div>}
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === 'products' && (
        <div style={s.content}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={s.sectionTitle}>Товары в каталоге</div>
            <button style={s.btnGold} onClick={openNew}>+ Добавить</button>
          </div>

          {/* Form */}
          {showForm && (
            <div style={s.formBox}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'var(--gold)', marginBottom: '1rem' }}>
                {editProduct ? 'Редактировать товар' : 'Новый товар'}
              </div>

              <div style={s.row}>
                <Field label="Название RU *" value={formData.nameRu} onChange={set('nameRu')} />
                <Field label="Название UZ" value={formData.nameUz} onChange={set('nameUz')} />
                <Field label="Название EN" value={formData.nameEn} onChange={set('nameEn')} />
              </div>
              <div style={s.row}>
                <Field label="Размер (25×150×6000)" value={formData.size} onChange={set('size')} />
                <Field label="Цена" value={formData.price} onChange={set('price')} placeholder="По запросу" />
                <div style={s.fieldWrap}>
                  <label style={s.label}>Категория</label>
                  <select style={s.select} value={formData.cat} onChange={set('cat')}>
                    {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Позиция</label>
                  <input style={s.input} type="number" value={formData.position}
                    onChange={e => setFormData(f => ({ ...f, position: +e.target.value }))} />
                </div>
              </div>

              {/* Image with preview */}
              <div style={s.fieldWrap}>
                <label style={s.label}>URL фото</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <input style={{ ...s.input, flex: 1 }} value={formData.img} onChange={set('img')}
                    placeholder="https://images.unsplash.com/..." />
                  {formData.img && (
                    <img src={formData.img} alt="preview"
                      style={{ width: 80, height: 60, objectFit: 'cover', border: '1px solid var(--brd2)', flexShrink: 0 }}
                      onError={e => (e.currentTarget.style.display = 'none')} />
                  )}
                </div>
              </div>

              <div style={s.divider}>Описание</div>
              <div style={s.row}>
                <TextArea label="Описание RU" value={formData.descRu} onChange={set('descRu')} />
                <TextArea label="Описание UZ" value={formData.descUz} onChange={set('descUz')} />
                <TextArea label="Описание EN" value={formData.descEn} onChange={set('descEn')} />
              </div>

              <div style={s.divider}>Теги</div>
              <div style={s.row}>
                <TagEditor label="Теги RU" value={formData.tagsRu} onChange={v => setFormData(f => ({ ...f, tagsRu: v }))} />
                <TagEditor label="Теги UZ" value={formData.tagsUz} onChange={v => setFormData(f => ({ ...f, tagsUz: v }))} />
                <TagEditor label="Теги EN" value={formData.tagsEn} onChange={v => setFormData(f => ({ ...f, tagsEn: v }))} />
              </div>

              <div style={s.divider}>Характеристики</div>
              <div style={s.row}>
                <SpecEditor label="Характеристики RU" value={formData.specsRu} onChange={v => setFormData(f => ({ ...f, specsRu: v }))} />
                <SpecEditor label="Характеристики UZ" value={formData.specsUz} onChange={v => setFormData(f => ({ ...f, specsUz: v }))} />
                <SpecEditor label="Характеристики EN" value={formData.specsEn} onChange={v => setFormData(f => ({ ...f, specsEn: v }))} />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button style={s.btnGold} onClick={save} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
                <button style={s.btnGhost} onClick={() => setShowForm(false)}>Отмена</button>
              </div>
            </div>
          )}

          {/* Product list */}
          <div style={s.table}>
            <div style={s.tableHead}>
              <span style={{ flex: '0 0 60px' }}>Фото</span>
              <span style={{ flex: 3 }}>Название</span>
              <span style={{ flex: 2 }}>Размер</span>
              <span style={{ flex: 1 }}>Кат.</span>
              <span style={{ flex: 2 }}>Цена</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Активен</span>
              <span style={{ flex: 2 }}>Действия</span>
            </div>
            {products.map(p => (
              <div key={p.id} style={{ ...s.tableRow, opacity: p.active ? 1 : 0.45 }}>
                <span style={{ flex: '0 0 60px' }}>
                  {p.img
                    ? <img src={p.img} alt="" style={{ width: 52, height: 40, objectFit: 'cover', display: 'block' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    : <div style={{ width: 52, height: 40, background: 'var(--bg3)' }} />}
                </span>
                <span style={{ flex: 3, color: 'var(--txt)', fontSize: 13 }}>{p.nameRu}</span>
                <span style={{ flex: 2, color: 'var(--txt2)', fontSize: 12 }}>{p.size}</span>
                <span style={{ flex: 1, color: 'var(--txt3)', fontSize: 11 }}>{p.cat}</span>
                <span style={{ flex: 2, color: 'var(--gold)', fontSize: 12 }}>{p.price || 'По запросу'}</span>
                <span style={{ flex: 1, textAlign: 'center' }}>
                  <button
                    style={{ ...s.toggle, background: p.active ? 'var(--gold)' : 'var(--bg3)', borderColor: p.active ? 'var(--gold)' : 'var(--brd)' }}
                    onClick={() => toggleActive(p)}
                    title={p.active ? 'Скрыть' : 'Показать'}
                  >
                    {p.active ? '✓' : '○'}
                  </button>
                </span>
                <span style={{ flex: 2, display: 'flex', gap: 6 }}>
                  <button style={s.actionBtn} onClick={() => openEdit(p)}>✏️</button>
                  <button style={{ ...s.actionBtn, borderColor: '#c44' }} onClick={() => del(p.id)}>🗑️</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        <div style={s.content}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
            <div style={s.sectionTitle}>Заявки</div>
            <button style={s.btnGhost} onClick={() => exportCSV(orders)}>⬇ Экспорт CSV</button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <input
              style={{ ...s.input, width: 220, marginBottom: 0 }}
              placeholder="Поиск по имени / телефону"
              value={orderSearch}
              onChange={e => setOrderSearch(e.target.value)}
            />
            {(['all', 'new', 'processing', 'done'] as const).map(f => (
              <button
                key={f}
                style={{ ...s.tab, ...(orderFilter === f ? { background: 'var(--bg3)', borderColor: 'var(--gold3)', color: 'var(--gold)' } : {}) }}
                onClick={() => setOrderFilter(f)}
              >
                {f === 'all' ? 'Все' : f === 'new' ? 'Новые' : f === 'processing' ? 'В работе' : 'Готово'}
                {' '}({orders.filter(o => f === 'all' || o.status === f).length})
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div style={{ color: 'var(--txt3)', fontSize: 13, padding: '2rem 0' }}>Нет заявок</div>
          )}
          {filteredOrders.map(o => (
            <div key={o.id} style={s.orderCard}>
              <div style={s.orderTop}>
                <div>
                  <div style={s.orderName}>{o.name}</div>
                  <a href={`tel:${o.phone}`} style={s.orderPhone}>{o.phone}</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...s.statusBadge, background: STATUS_COLORS[o.status] || '#666' }}>{o.status}</span>
                  <select style={s.statusSelect} value={o.status} onChange={e => changeStatus(o.id, e.target.value)}>
                    <option value="new">new</option>
                    <option value="processing">processing</option>
                    <option value="done">done</option>
                  </select>
                  <button style={{ ...s.actionBtn, fontSize: 12 }} onClick={() => delOrder(o.id)}>🗑️</button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--txt2)', lineHeight: 1.7, marginTop: 6 }}>
                {o.product && <span><span style={{ color: 'var(--txt3)', fontSize: 11 }}>Товар:</span> {o.product} </span>}
                {o.volume && <span><span style={{ color: 'var(--txt3)', fontSize: 11 }}>Объём:</span> {o.volume} </span>}
                {o.comment && <div><span style={{ color: 'var(--txt3)', fontSize: 11 }}>Комментарий:</span> {o.comment}</div>}
                <div style={{ color: 'var(--txt3)', fontSize: 11, marginTop: 4 }}>{new Date(o.createdAt).toLocaleString('ru-RU')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
function TextArea({ label, value, onChange }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <textarea style={{ ...s.input, height: 64, resize: 'vertical' }} value={value} onChange={onChange} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' },
  loginBox: { background: 'var(--bg2)', border: '1px solid var(--brd)', padding: '2.5rem', width: 340, display: 'flex', flexDirection: 'column', gap: 14 },
  logoMark: { width: 32, height: 32, border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: 'var(--gold)', flexShrink: 0 },
  wrap: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)' },
  header: { background: 'var(--bg2)', borderBottom: '1px solid var(--brd2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1rem,4vw,2rem)', height: 60, gap: 12, position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap' },
  tab: { background: 'none', border: '1px solid var(--brd)', color: 'var(--txt2)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, padding: '5px 12px', cursor: 'pointer', borderRadius: 2 },
  tabOn: { background: 'var(--bg3)', border: '1px solid var(--gold3)', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, padding: '5px 12px', cursor: 'pointer', borderRadius: 2 },
  content: { padding: 'clamp(1rem,4vw,2rem)' },
  sectionTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1, background: 'var(--brd2)' },
  statCard: { background: 'var(--bg2)', padding: '1.25rem 1rem', textAlign: 'center' },
  statNum: { fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 400, color: 'var(--gold)', lineHeight: 1 },
  statLbl: { fontSize: 10, color: 'var(--txt3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: 4 },
  formBox: { background: 'var(--bg2)', border: '1px solid var(--brd)', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 2 },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 12 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--txt3)' },
  input: { background: 'var(--bg3)', border: '1px solid var(--brd2)', color: 'var(--txt)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '8px 10px', outline: 'none', borderRadius: 2, width: '100%', marginBottom: 0 } as React.CSSProperties,
  select: { background: 'var(--bg3)', border: '1px solid var(--brd2)', color: 'var(--txt)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '8px 10px', outline: 'none', borderRadius: 2 },
  divider: { fontSize: 10, color: 'var(--txt3)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid var(--brd2)', paddingBottom: 6, marginBottom: 10, marginTop: 6 },
  btnGold: { background: 'var(--gold)', color: '#0D0B08', border: 'none', padding: '9px 20px', fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', borderRadius: 2 },
  btnGhost: { background: 'transparent', color: 'var(--txt2)', border: '1px solid var(--brd)', padding: '9px 18px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', borderRadius: 2 },
  btnSmall: { background: 'none', border: '1px solid var(--brd)', color: 'var(--txt2)', fontSize: 12, padding: '4px 10px', cursor: 'pointer', borderRadius: 2, flexShrink: 0 },
  table: { background: 'var(--bg2)', border: '1px solid var(--brd2)' },
  tableHead: { display: 'flex', padding: '8px 14px', background: 'var(--bg3)', borderBottom: '1px solid var(--brd2)', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--txt3)', gap: 8, alignItems: 'center' },
  tableRow: { display: 'flex', padding: '10px 14px', borderBottom: '1px solid var(--brd2)', alignItems: 'center', gap: 8 },
  actionBtn: { background: 'none', border: '1px solid var(--brd)', padding: '4px 8px', cursor: 'pointer', fontSize: 13, borderRadius: 2 },
  toggle: { width: 28, height: 22, border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 700, borderRadius: 2, color: '#0D0B08' },
  orderCard: { background: 'var(--bg2)', border: '1px solid var(--brd2)', marginBottom: 8, padding: '0.9rem 1.1rem' },
  orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderName: { fontSize: 14, fontWeight: 500, color: 'var(--txt)', marginBottom: 2 },
  orderPhone: { color: 'var(--gold)', fontSize: 13, textDecoration: 'none' },
  statusBadge: { fontSize: 10, padding: '2px 7px', color: '#0D0B08', fontWeight: 600, borderRadius: 2 },
  statusSelect: { background: 'var(--bg3)', border: '1px solid var(--brd)', color: 'var(--txt)', fontSize: 11, padding: '3px 6px', cursor: 'pointer', borderRadius: 2 },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg3)', border: '1px solid var(--gold3)', color: 'var(--gold)', fontSize: 11, padding: '2px 8px', borderRadius: 10 },
  chipX: { background: 'none', border: 'none', color: 'var(--gold3)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0 },
  msgBar: { background: 'rgba(201,151,74,0.1)', border: '1px solid var(--gold3)', color: 'var(--gold)', padding: '7px 1.5rem', fontSize: 12 },
};
