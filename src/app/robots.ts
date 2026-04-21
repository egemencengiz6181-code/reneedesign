import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const origin = 'https://www.zekeriyakoyfenbilimleri.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/wp-admin/',
          '/wp-login/',
          '/wp-includes/',
          '/wp-content/',
          '/cgi-bin/',
          '/vendor/',
          '/.env',
          '/.git/',
          '/phpmyadmin/',
          '/telescope/',
          '/actuator/',
          '/solr/',
          '/_ignition/',
        ],
      },
      // Zararlı botları tamamen engelle
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
      { userAgent: 'BLEXBot', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
