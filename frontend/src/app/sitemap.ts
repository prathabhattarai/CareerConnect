import { MetadataRoute } from 'next';

const BASE_URL = 'https://careerconnect-orpin.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/login',
    '/register',
    '/jobs',
    '/about',
    '/contact',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  return [...staticPages];
}
