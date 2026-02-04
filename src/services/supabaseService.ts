import { projectId, publicAnonKey } from '../config/supabase';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c08f8213`;

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
