import type { MetadataRoute } from 'next';
import { BLOG_ARTICLES } from '@/lib/blog/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bookgenie-app.netlify.app';
  const lastModified = new Date();

  const coreRoutes = [
    '',
    '/pricing',
    '/how-it-works',
    '/features',
    '/about',
    '/help',
    '/contact',
    '/faq',
    '/affiliate',
    '/digital-blueprint',
    '/glow-up',
    '/my-ebooks',
    '/blog',
    '/terms',
    '/privacy',
    '/cookies',
    '/refunds',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: (route === '' || route === '/pricing' || route === '/digital-blueprint' || route === '/glow-up'
      ? 'weekly'
      : 'monthly') as 'weekly' | 'monthly',
    priority: route === '' ? 1.0 : route.startsWith('/blog') || route === '/digital-blueprint' || route === '/glow-up' ? 0.8 : 0.6,
  }));

  const blogRoutes = Object.keys(BLOG_ARTICLES).map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...coreRoutes, ...blogRoutes];
}
