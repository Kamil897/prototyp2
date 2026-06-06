import { Product } from '../types';

const BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function submitOrder(data: {
  name: string;
  phone: string;
  product?: string;
  volume?: string;
  comment?: string;
}): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit order');
  return res.json();
}
