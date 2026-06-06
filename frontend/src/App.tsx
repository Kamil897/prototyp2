import { useState } from 'react';
import { Page, Product } from './types';
import { Topbar } from './components/Topbar';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { useProducts } from './hooks/useProducts';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [preselected, setPreselected] = useState('');
  const { products, loading } = useProducts();

  const navigate = (p: Page) => setPage(p);

  const openProduct = (id: number) => {
    const p = products.find((x) => x.id === id) || null;
    setModalProduct(p);
  };

  const orderFromModal = () => {
    if (!modalProduct) return;
    setPreselected(`${modalProduct.name.ru} ${modalProduct.size}`);
    setModalProduct(null);
    setPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Topbar currentPage={page} onNavigate={navigate} />

      {loading ? (
        <div className="loading-state">
          <i className="ti ti-loader" style={{ animation: 'spin 1s linear infinite' }} />
          Загрузка...
        </div>
      ) : (
        <>
          {page === 'home' && (
            <HomePage products={products} onNavigate={navigate} onProductClick={openProduct} />
          )}
          {page === 'catalog' && (
            <CatalogPage products={products} onProductClick={openProduct} preselectedProduct={preselected} />
          )}
          {page === 'about' && <AboutPage />}
          {page === 'contact' && (
            <ContactPage products={products} preselectedProduct={preselected} />
          )}
        </>
      )}

      <Footer onNavigate={navigate} />

      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onOrder={orderFromModal}
        />
      )}
    </>
  );
}
