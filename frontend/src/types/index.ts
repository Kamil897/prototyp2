export type Lang = 'ru' | 'uz' | 'en';
export type Page = 'home' | 'catalog' | 'about' | 'contact';
export type CatFilter = 'all' | 'board' | 'beam' | 'batten' | 'finishing';

export interface I18n<T> {
  ru: T;
  uz: T;
  en: T;
}

export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: number;
  name: I18n<string>;
  size: string;
  cat: CatFilter;
  cls: string;
  img: string;
  tags: I18n<string[]>;
  desc: I18n<string>;
  specs: I18n<ProductSpecs>;
}
