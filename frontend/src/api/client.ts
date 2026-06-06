import { Product } from '../types';

const BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function submitOrder(data: {
  name: string; phone: string; product?: string; volume?: string; comment?: string;
}): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit order');
  return res.json();
}

// ── ADMIN ──
function adminHeaders(password: string) {
  return { 'Content-Type': 'application/json', 'x-admin-token': password };
}

export async function adminFetchProducts(password: string) {
  const res = await fetch(`${BASE}/products?all=1`, { headers: adminHeaders(password) });
  if (res.status === 401) throw new Error('wrong_password');
  return res.json();
}

export async function adminFetchOrders(password: string) {
  const res = await fetch(`${BASE}/admin/orders`, { headers: adminHeaders(password) });
  if (res.status === 401) throw new Error('wrong_password');
  return res.json();
}

export async function adminCreateProduct(password: string, data: any) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function adminUpdateProduct(password: string, id: number, data: any) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: adminHeaders(password),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function adminDeleteProduct(password: string, id: number) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(password),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export async function adminUpdateOrderStatus(password: string, id: string, status: string) {
  const res = await fetch(`${BASE}/admin/orders/${id}`, {
    method: 'PATCH',
    headers: adminHeaders(password),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
