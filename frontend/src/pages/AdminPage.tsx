import { useState, useEffect, useCallback } from 'react';
import {
  adminFetchProducts, adminFetchOrders,
  adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminUpdateOrderStatus,
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

const EMPTY_PRODUCT: Omit<AdminProduct, 'id'> = {
  nameRu: '', nameUz: '', nameEn: '', size: '', cat: 'board', cls: 'g1',
  img: '', price: '', tagsRu: '[]', tagsUz: '[]', tagsEn: '[]',
  descRu: '', descUz: '', descEn: '',
  specsRu: '{}', specsUz: '{}', specsEn: '{}',
  active: true, position: 0,
};

const CAT_OPTIONS = ['board', 'beam', 'batten', 'finishing'];
const CLS_OPTIONS = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
const STATUS_COLORS: Record<string, string> = {
  new: '#C9974A', processing: '#4A90C9', done: '#4AC974',
};

// ── Main component ─────────────────────────────────────────
export function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<AdminProduct, 'id'>>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(async (pwd: string) => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        adminFetchProducts(pwd),
        adminFetchOrders(pwd),
      ]);
      setProducts(prods);
      setOrders(ords);
      setAuthed(true);
    } catch (e: any) {
      if (e.message === 'wrong_password') setAuthError('Неверный пароль');
      else setAuthError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async () => {
    setAuthError('');
    await load(password);
  };

  const openNew = () => {
    setEditProduct(null);
    setFormData(EMPTY_PRODUCT);
    setShowForm(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p);
    setFormData({ ...p });
    setShowForm(true);
  };

  const set = (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData(f => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      if (editProduct) {
        await adminUpdateProduct(password, editProduct.id, formData);
      } else {
        await adminCreateProduct(password, formData);
      }
      setShowForm(false);
      setMsg('✓ Сохранено');
      await load(password);
    } catch {
      setMsg('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    await adminDeleteProduct(password, id);
    await load(password);
  };

  const changeStatus = async (id: string, status: string) => {
    await adminUpdateOrderStatus(password, id, status);
    await load(password);
  };

  // ── Login screen ─────────────────────────────────────────
  if (!authed) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginBox}>
          <div style={s.loginLogo}>
            <div style={s.logoMark}>A</div>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}>
              APS <span style={{ color: 'var(--gold)' }}>Wild Card</span>
            </span>
          </div>
          <div style={s.loginTitle}>Панель управления</div>
          <input
            style={s.input}
            type="password"
            placeholder="Пароль администратора"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
          {authError && <div style={s.err}>{authError}</div>}
          <button style={s.btnGold} onClick={login} disabled={loading}>
            {loading ? 'Подключение...' : 'Войти'}
          </button>
        </div>
      </div>
    );
  }

  // ── Main admin UI ─────────────────────────────────────────
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={tab === 'products' ? s.tabOn : s.tab} onClick={() => setTab('products')}>
            Товары ({products.length})
          </button>
          <button style={tab === 'orders' ? s.tabOn : s.tab} onClick={() => setTab('orders')}>
            Заявки ({orders.filter(o => o.status === 'new').length} новых)
          </button>
        </div>
        <button style={s.btnGhost} onClick={() => setAuthed(false)}>Выйти</button>
      </div>

      {msg && <div style={s.msgBar}>{msg}</div>}

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <div style={s.content}>
          <div style={s.toolbar}>
            <span style={s.sectionTitle}>Товары в каталоге</span>
            <button style={s.btnGold} onClick={openNew}>+ Добавить товар</button>
          </div>

          {/* Product form */}
          {showForm && (
            <div style={s.formBox}>
              <div style={s.formTitle}>{editProduct ? 'Редактировать товар' : 'Новый товар'}</div>

              <div style={s.row}>
                <Field label="Название RU" value={formData.nameRu} onChange={set('nameRu')} />
                <Field label="Название UZ" value={formData.nameUz} onChange={set('nameUz')} />
                <Field label="Название EN" value={formData.nameEn} onChange={set('nameEn')} />
              </div>
              <div style={s.row}>
                <Field label="Размер (напр. 25×150×6000)" value={formData.size} onChange={set('size')} />
                <Field label="Цена (напр. 150 000 сум/м³)" value={formData.price} onChange={set('price')} placeholder="По запросу" />
              </div>
              <div style={s.row}>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Категория</label>
                  <select style={s.select} value={formData.cat} onChange={set('cat')}>
                    {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Цвет фона (без фото)</label>
                  <select style={s.select} value={formData.cls} onChange={set('cls')}>
                    {CLS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Позиция</label>
                  <input style={s.input} type="number" value={formData.position}
                    onChange={e => setFormData(f => ({ ...f, position: +e.target.value }))} />
                </div>
              </div>
              <Field label="URL фото" value={formData.img} onChange={set('img')} placeholder="https://images.unsplash.com/..." />

              <div style={s.divider}>Описание</div>
              <TextArea label="Описание RU" value={formData.descRu} onChange={set('descRu')} />
              <TextArea label="Описание UZ" value={formData.descUz} onChange={set('descUz')} />
              <TextArea label="Описание EN" value={formData.descEn} onChange={set('descEn')} />

              <div style={s.divider}>Теги (JSON массив, напр: ["Сосна","1 сорт"])</div>
              <div style={s.row}>
                <Field label="Теги RU" value={formData.tagsRu} onChange={set('tagsRu')} />
                <Field label="Теги UZ" value={formData.tagsUz} onChange={set('tagsUz')} />
                <Field label="Теги EN" value={formData.tagsEn} onChange={set('tagsEn')} />
              </div>

              <div style={s.divider}>Характеристики (JSON объект, напр: {"{"}"Порода":"Сосна"{"}"}</div>
              <TextArea label="Характеристики RU" value={formData.specsRu} onChange={set('specsRu')} />
              <TextArea label="Характеристики UZ" value={formData.specsUz} onChange={set('specsUz')} />
              <TextArea label="Характеристики EN" value={formData.specsEn} onChange={set('specsEn')} />

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button style={s.btnGold} onClick={save} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button style={s.btnGhost} onClick={() => setShowForm(false)}>Отмена</button>
              </div>
            </div>
          )}

          {/* Products table */}
          <div style={s.table}>
            <div style={s.tableHead}>
              <span style={{ flex: 3 }}>Название</span>
              <span style={{ flex: 2 }}>Размер</span>
              <span style={{ flex: 1 }}>Категория</span>
              <span style={{ flex: 2 }}>Цена</span>
              <span style={{ flex: 1 }}>Позиция</span>
              <span style={{ flex: 2 }}>Действия</span>
            </div>
            {products.map(p => (
              <div key={p.id} style={s.tableRow}>
                <span style={{ flex: 3, color: 'var(--txt)', fontSize: 13 }}>{p.nameRu}</span>
                <span style={{ flex: 2, color: 'var(--txt2)', fontSize: 12 }}>{p.size}</span>
                <span style={{ flex: 1, color: 'var(--txt3)', fontSize: 11 }}>{p.cat}</span>
                <span style={{ flex: 2, color: 'var(--gold)', fontSize: 12 }}>
                  {p.price || 'По запросу'}
                </span>
                <span style={{ flex: 1, color: 'var(--txt3)', fontSize: 12 }}>{p.position}</span>
                <span style={{ flex: 2, display: 'flex', gap: 6 }}>
                  <button style={s.actionBtn} onClick={() => openEdit(p)}>✏️</button>
                  <button style={{ ...s.actionBtn, borderColor: '#c44' }} onClick={() => del(p.id)}>🗑️</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === 'orders' && (
        <div style={s.content}>
          <div style={s.toolbar}>
            <span style={s.sectionTitle}>Заявки от клиентов</span>
            <span style={{ fontSize: 12, color: 'var(--txt3)' }}>Всего: {orders.length}</span>
          </div>
          {orders.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--txt3)', fontSize: 13 }}>
              Заявок пока нет
            </div>
          )}
          {orders.map(o => (
            <div key={o.id} style={s.orderCard}>
              <div style={s.orderTop}>
                <div>
                  <div style={s.orderName}>{o.name}</div>
                  <a href={`tel:${o.phone}`} style={s.orderPhone}>{o.phone}</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...s.statusBadge, background: STATUS_COLORS[o.status] || '#666' }}>
                    {o.status}
                  </span>
                  <select
                    style={s.statusSelect}
                    value={o.status}
                    onChange={e => changeStatus(o.id, e.target.value)}
                  >
                    <option value="new">new</option>
                    <option value="processing">processing</option>
                    <option value="done">done</option>
                  </select>
                </div>
              </div>
              <div style={s.orderDetails}>
                {o.product && <div><span style={s.detailLabel}>Товар:</span> {o.product}</div>}
                {o.volume && <div><span style={s.detailLabel}>Объём:</span> {o.volume}</div>}
                {o.comment && <div><span style={s.detailLabel}>Комментарий:</span> {o.comment}</div>}
                <div style={{ color: 'var(--txt3)', fontSize: 11, marginTop: 4 }}>
                  {new Date(o.createdAt).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Helper components ─────────────────────────────────────
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
      <textarea style={{ ...s.input, height: 60, resize: 'vertical' }} value={value} onChange={onChange} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' },
  loginBox: { background: 'var(--bg2)', border: '1px solid var(--brd)', padding: '2.5rem', width: 340, display: 'flex', flexDirection: 'column', gap: 16 },
  loginLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  loginTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'var(--txt)' },
  logoMark: { width: 32, height: 32, border: '1.5px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 16, fontWeight: 600, color: 'var(--gold)', flexShrink: 0 },
  wrap: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--txt)' },
  header: { background: 'var(--bg2)', borderBottom: '1px solid var(--brd2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1rem,4vw,2.5rem)', height: 60, gap: 12, position: 'sticky', top: 0, zIndex: 100 },
  tab: { background: 'none', border: '1px solid var(--brd)', color: 'var(--txt2)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, padding: '5px 14px', cursor: 'pointer', borderRadius: 2 },
  tabOn: { background: 'var(--bg3)', border: '1px solid var(--gold3)', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', fontSize: 12, padding: '5px 14px', cursor: 'pointer', borderRadius: 2 },
  content: { padding: 'clamp(1rem,4vw,2.5rem)' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  sectionTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 300 },
  formBox: { background: 'var(--bg2)', border: '1px solid var(--brd)', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 2 },
  formTitle: { fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, marginBottom: '1rem', color: 'var(--gold)' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--txt3)' },
  input: { background: 'var(--bg3)', border: '1px solid var(--brd2)', color: 'var(--txt)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '8px 10px', outline: 'none', borderRadius: 2, width: '100%' } as React.CSSProperties,
  select: { background: 'var(--bg3)', border: '1px solid var(--brd2)', color: 'var(--txt)', fontFamily: 'DM Sans, sans-serif', fontSize: 13, padding: '8px 10px', outline: 'none', borderRadius: 2, width: '100%' },
  divider: { fontSize: 11, color: 'var(--txt3)', borderBottom: '1px solid var(--brd2)', paddingBottom: 6, marginBottom: 12, marginTop: 8 },
  btnGold: { background: 'var(--gold)', color: '#0D0B08', border: 'none', padding: '10px 20px', fontSize: 12, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', borderRadius: 2 },
  btnGhost: { background: 'transparent', color: 'var(--txt2)', border: '1px solid var(--brd)', padding: '10px 20px', fontSize: 12, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', borderRadius: 2 },
  table: { background: 'var(--bg2)', border: '1px solid var(--brd2)' },
  tableHead: { display: 'flex', padding: '10px 16px', background: 'var(--bg3)', borderBottom: '1px solid var(--brd2)', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--txt3)', gap: 8 },
  tableRow: { display: 'flex', padding: '12px 16px', borderBottom: '1px solid var(--brd2)', alignItems: 'center', gap: 8 },
  actionBtn: { background: 'none', border: '1px solid var(--brd)', padding: '4px 8px', cursor: 'pointer', fontSize: 14, borderRadius: 2 },
  orderCard: { background: 'var(--bg2)', border: '1px solid var(--brd2)', marginBottom: 8, padding: '1rem 1.25rem' },
  orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  orderName: { fontSize: 15, fontWeight: 500, color: 'var(--txt)', marginBottom: 3 },
  orderPhone: { color: 'var(--gold)', fontSize: 13, textDecoration: 'none' },
  orderDetails: { fontSize: 13, color: 'var(--txt2)', lineHeight: 1.7 },
  detailLabel: { color: 'var(--txt3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' },
  statusBadge: { fontSize: 10, padding: '2px 8px', color: '#0D0B08', fontWeight: 600, letterSpacing: '0.5px', borderRadius: 2 },
  statusSelect: { background: 'var(--bg3)', border: '1px solid var(--brd)', color: 'var(--txt)', fontSize: 11, padding: '3px 8px', cursor: 'pointer', borderRadius: 2 },
  err: { color: '#e05555', fontSize: 12 },
  msgBar: { background: 'rgba(201,151,74,0.1)', border: '1px solid var(--gold3)', color: 'var(--gold)', padding: '8px 1.5rem', fontSize: 12 },
};
