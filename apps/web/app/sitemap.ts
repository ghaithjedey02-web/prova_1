import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

/**
 * Only routes that carry real content. Case studies and sector pages exist as
 * architecture but are deliberately absent until they hold something true.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/soluzioni', '/dimostrazione', '/affidabilita', '/metodo', '/studio', '/contatto'];
  const now = new Date();
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === '' ? 'monthly' : 'yearly',
    priority: r === '' ? 1 : r === '/dimostrazione' ? 0.9 : r === '/soluzioni' ? 0.8 : 0.7,
  }));
}
