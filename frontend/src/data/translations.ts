import { Lang } from '../types';

export type TranslationKey =
  | 'h-eye' | 'h-ttl' | 'h-sub' | 'h-b1' | 'h-b2' | 'h-view-all'
  | 'm1' | 'm2' | 'm3' | 'm4'
  | 'pr1' | 'pr2' | 'pr3' | 'pr4'
  | 's1t' | 's1h'
  | 'c-tag' | 'c-title'
  | 'a-tag' | 'a-title' | 'a1' | 'a2' | 'a3' | 'a4'
  | 'ap1' | 'ap2'
  | 'f1' | 'f2' | 'f3' | 'f4' | 'f5'
  | 'co-tag' | 'co-title'
  | 'cl1' | 'cl2' | 'cl-phone' | 'cl-work' | 'cl-hours' | 'cl-map' | 'cl-map2'
  | 'fh' | 'fl1' | 'fl2' | 'fl3' | 'fl4' | 'fl5' | 'sbtn' | 'ok'
  | 'fb-desc'
  | 'fc1-h' | 'fc2-h' | 'fc-home' | 'fc-cat' | 'fc-about' | 'fc-contact'
  | 'f-city' | 'f-copy' | 'f-lic'
  | 'n-home' | 'n-catalog' | 'n-about' | 'n-contact'
  | 'modal-order' | 'no-results' | 'cat-search-ph'
  | 'price-on-request' | 'details' | 'close' | 'fc3-h';

type Translations = Record<Lang, Record<TranslationKey, string>>;

export const T: Translations = {
  ru: {
    'h-eye': 'Оптовые поставки · Ташкент',
    'h-ttl': 'Пиломатериалы<br><em>из сердца Сибири</em>',
    'h-sub': 'Сертифицированная сосна и ель напрямую от российских производителей. Доски, брусья, рейки — любые объёмы с гарантией качества.',
    'h-b1': 'Смотреть каталог', 'h-b2': 'Оставить заявку', 'h-view-all': 'Весь каталог →',
    'm1': 'Год основания', 'm2': 'Позиций', 'm3': 'Сертифицировано', 'm4': 'Ответ',
    'pr1': 'Доставка по Узбекистану', 'pr2': 'Все сертификаты', 'pr3': 'Прямо от производителя', 'pr4': 'Ответ за 24 часа',
    's1t': 'Ассортимент', 's1h': 'Популярные <em>позиции</em>',
    'c-tag': 'Вся продукция', 'c-title': 'Каталог <em>пиломатериалов</em>',
    'a-tag': 'О компании', 'a-title': 'APS Wild Card <em>MCHJ</em>',
    'a1': 'Год основания', 'a2': 'Ташкент', 'a3': 'Поставщик', 'a4': 'Опт',
    'ap1': 'APS Wild Card специализируется на импорте и оптовой продаже пиломатериалов хвойных пород из России. Работаем напрямую с сертифицированными заводами — без посредников.',
    'ap2': 'На складе в Ташкенте широкий ассортимент: доски, брусья, рейки. Вся продукция поставляется с полным пакетом документов. Минимальный заказ от 5 м³.',
    'f1': 'Прямые поставки — без посредников', 'f2': 'Сертификаты и документы на всю продукцию',
    'f3': 'Гибкие условия оплаты', 'f4': 'Доставка по всему Узбекистану', 'f5': 'Ответ в течение 24 часов',
    'co-tag': 'Связаться с нами', 'co-title': 'Контакты <em>и заявка</em>',
    'cl1': 'Офис', 'cl2': 'Склад', 'cl-phone': 'Телефон', 'cl-work': 'Режим работы', 'cl-hours': 'Пн–Сб: 9:00 – 20:00', 'cl-map': 'Офис на карте', 'cl-map2': 'Склад на карте',
    'fh': 'Оставить заявку', 'fl1': 'Имя', 'fl2': 'Телефон', 'fl3': 'Продукт', 'fl4': 'Объём', 'fl5': 'Комментарий',
    'sbtn': 'Отправить заявку', 'ok': '✓ Заявка принята — свяжемся в течение 24 часов',
    'fb-desc': 'Оптовые поставки пиломатериалов хвойных пород. Прямо с российских заводов — на ваш склад в Узбекистане.',
    'fc1-h': 'Навигация', 'fc2-h': 'Продукция', 'fc-home': 'Главная', 'fc-cat': 'Каталог', 'fc-about': 'О нас', 'fc-contact': 'Контакты',
    'fc3-h': 'Контакты',
    'f-city': 'Ташкент', 'f-copy': '© 2024–2026 APS Wild Card MCHJ', 'f-lic': 'Все права защищены',
    'n-home': 'Главная', 'n-catalog': 'Каталог', 'n-about': 'О нас', 'n-contact': 'Контакты',
    'modal-order': 'Оставить заявку', 'no-results': 'Ничего не найдено', 'cat-search-ph': 'Поиск по каталогу...',
    'price-on-request': 'Цена по запросу', 'details': 'Подробнее', 'close': 'Закрыть',
  },
  uz: {
    'h-eye': "Ulgurji yetkazib berish · Toshkent",
    'h-ttl': "Yog'och materiallar<br><em>Sibirdan keladi</em>",
    'h-sub': "Rossiyadan sertifikatlangan qarag'ay va archa. Taxtalar, bruslar, reykalar — har qanday hajmda, sifat kafolati bilan.",
    'h-b1': "Katalogni ko'rish", 'h-b2': 'Ariza qoldirish', 'h-view-all': 'Barcha katalog →',
    'm1': 'Asos yili', 'm2': 'Pozitsiya', 'm3': 'Sertifikatlangan', 'm4': 'Javob',
    'pr1': "O'zbekiston bo'ylab yetkazib berish", 'pr2': 'Barcha sertifikatlar', 'pr3': "Ishlab chiqaruvchidan to'g'ri", 'pr4': '24 soat ichida javob',
    's1t': 'Assortiment', 's1h': 'Mashhur <em>pozitsiyalar</em>',
    'c-tag': "Barcha mahsulotlar", 'c-title': "Yog'och materiallar <em>katalogi</em>",
    'a-tag': 'Kompaniya haqida', 'a-title': 'APS Wild Card <em>MCHJ</em>',
    'a1': 'Asos yili', 'a2': 'Toshkent', 'a3': 'Yetkazuvchi', 'a4': 'Ulgurji',
    'ap1': "APS Wild Card Rossiyadan ignabargli yog'och materiallarini import qilish va ulgurji sotishga ixtisoslashgan.",
    'ap2': "Toshkentdagi omborda keng assortiment: taxtalar, bruslar, reykalar. Barcha mahsulotlar hujjatlar bilan keladi.",
    'f1': "To'g'ridan-to'g'ri yetkazib berish — vositachilarsiz", 'f2': 'Barcha mahsulotlar uchun sertifikatlar',
    'f3': "Doimiy mijozlar uchun moslashuvchan to'lov", 'f4': "O'zbekiston bo'ylab yetkazib berish", 'f5': '24 soat ichida javob',
    'co-tag': 'Biz bilan bog\'laning', 'co-title': 'Aloqa <em>va ariza</em>',
    'cl1': 'Ofis', 'cl2': 'Ombor', 'cl-phone': 'Telefon', 'cl-work': 'Ish vaqti', 'cl-hours': 'Du–Sha: 9:00 – 20:00', 'cl-map': 'Ofis xaritada', 'cl-map2': 'Ombor xaritada',
    'fh': 'Ariza qoldirish', 'fl1': 'Ism', 'fl2': 'Telefon', 'fl3': 'Mahsulot', 'fl4': 'Hajm', 'fl5': 'Izoh',
    'sbtn': 'Ariza yuborish', 'ok': "✓ Ariza qabul qilindi — 24 soat ichida bog'lanamiz",
    'fb-desc': "Ignabargli yog'och materiallarini ulgurji yetkazib berish.",
    'fc1-h': 'Navigatsiya', 'fc2-h': 'Mahsulotlar', 'fc-home': 'Bosh sahifa', 'fc-cat': 'Katalog', 'fc-about': 'Biz haqimizda', 'fc-contact': 'Aloqa',
    'fc3-h': 'Kontaktlar',
    'f-city': 'Toshkent', 'f-copy': '© 2024–2026 APS Wild Card MCHJ', 'f-lic': 'Barcha huquqlar himoyalangan',
    'n-home': 'Bosh sahifa', 'n-catalog': 'Katalog', 'n-about': 'Biz haqimizda', 'n-contact': 'Aloqa',
    'modal-order': 'Ariza qoldirish', 'no-results': 'Hech narsa topilmadi', 'cat-search-ph': 'Katalogda qidirish...',
    'price-on-request': "Narx so'rovda", 'details': 'Batafsil', 'close': 'Yopish',
  },
  en: {
    'h-eye': 'Wholesale Supplier · Tashkent',
    'h-ttl': 'Premium Timber<br><em>from Siberian forests</em>',
    'h-sub': 'Certified pine and spruce direct from Russian manufacturers. Boards, beams, battens — any volume, quality guaranteed.',
    'h-b1': 'View catalog', 'h-b2': 'Request a quote', 'h-view-all': 'Full catalog →',
    'm1': 'Founded', 'm2': 'Products', 'm3': 'Certified', 'm4': 'Response',
    'pr1': 'Delivery across Uzbekistan', 'pr2': 'All certificates', 'pr3': 'Direct from factory', 'pr4': '24-hour reply',
    's1t': 'Range', 's1h': 'Popular <em>items</em>',
    'c-tag': 'All products', 'c-title': 'Lumber <em>catalog</em>',
    'a-tag': 'About us', 'a-title': 'APS Wild Card <em>LLC</em>',
    'a1': 'Founded', 'a2': 'Tashkent', 'a3': 'Supplier', 'a4': 'Wholesale',
    'ap1': 'APS Wild Card specializes in importing and wholesale distribution of softwood lumber from Russia, working directly with certified manufacturers.',
    'ap2': 'Our Tashkent warehouse holds a wide selection of boards, beams, and battens. All products come with full documentation. Min order from 5 m³.',
    'f1': 'Direct supply — no middlemen', 'f2': 'Full certificates and documents',
    'f3': 'Flexible payment for regular clients', 'f4': 'Delivery across Uzbekistan', 'f5': '24-hour response',
    'co-tag': 'Get in touch', 'co-title': 'Contact <em>& order</em>',
    'cl1': 'Office', 'cl2': 'Warehouse', 'cl-phone': 'Phone', 'cl-work': 'Working hours', 'cl-hours': 'Mon–Sat: 9:00 – 20:00', 'cl-map': 'Office on map', 'cl-map2': 'Warehouse on map',
    'fh': 'Request a quote', 'fl1': 'Name', 'fl2': 'Phone', 'fl3': 'Product', 'fl4': 'Volume', 'fl5': 'Comments',
    'sbtn': 'Send request', 'ok': '✓ Request received — we will contact you within 24 hours',
    'fb-desc': 'Wholesale softwood lumber. Direct from Russian mills to your warehouse in Uzbekistan.',
    'fc1-h': 'Navigation', 'fc2-h': 'Products', 'fc-home': 'Home', 'fc-cat': 'Catalog', 'fc-about': 'About', 'fc-contact': 'Contact',
    'fc3-h': 'Contacts',
    'f-city': 'Tashkent', 'f-copy': '© 2024–2026 APS Wild Card LLC', 'f-lic': 'All rights reserved',
    'n-home': 'Home', 'n-catalog': 'Catalog', 'n-about': 'About', 'n-contact': 'Contact',
    'modal-order': 'Request a quote', 'no-results': 'No results found', 'cat-search-ph': 'Search catalog...',
    'price-on-request': 'Price on request', 'details': 'Details', 'close': 'Close',
  },
};

export const cats: Record<string, Record<Lang, string>> = {
  all: { ru: 'Все', uz: 'Barchasi', en: 'All' },
  board: { ru: 'Доска', uz: 'Taxta', en: 'Board' },
  beam: { ru: 'Брус', uz: 'Brus', en: 'Beam' },
  batten: { ru: 'Рейка', uz: 'Reyka', en: 'Batten' },
  finishing: { ru: 'Отделка', uz: 'Bezak', en: 'Finishing' },
};
