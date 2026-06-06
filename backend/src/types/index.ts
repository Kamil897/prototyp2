export type Lang = 'ru' | 'uz' | 'en';

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
  cat: 'board' | 'beam' | 'batten' | 'finishing';
  cls: string;
  img: string;
  tags: I18n<string[]>;
  desc: I18n<string>;
  specs: I18n<ProductSpecs>;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  product: string;
  volume: string;
  comment: string;
  createdAt: string;
  status: 'new' | 'processing' | 'done';
}

export interface CreateOrderDto {
  name: string;
  phone: string;
  product?: string;
  volume?: string;
  comment?: string;
}
