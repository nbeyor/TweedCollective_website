/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  async redirects() {
    return [
      // Specific redirects must come before the /documents catch-all
      {
        source: '/documents/health-tech-market-2024',
        destination: '/insights/health-tech-market-2026',
        permanent: true,
      },
      {
        source: '/insights/health-tech-market-2024',
        destination: '/insights/health-tech-market-2026',
        permanent: true,
      },
      {
        source: '/documents/ecs-sdlc-dashboard',
        destination: '/clients/ecs/sdlc-dashboard',
        permanent: true,
      },
      {
        source: '/documents/ecs-sdlc-dashboard/:sub*',
        destination: '/clients/ecs/sdlc-dashboard/:sub*',
        permanent: true,
      },
      {
        source: '/documents',
        destination: '/insights',
        permanent: true,
      },
      {
        source: '/documents/:path*',
        destination: '/insights/:path*',
        permanent: true,
      },
      // The magic-link invitation system was removed; send stale invite
      // emails to the homepage instead of a 404. Not permanent so browsers
      // don't cache it if anything ever lives at this path again.
      {
        source: '/magic-link/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://images.unsplash.com https://img.clerk.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev",
              "frame-src 'self' https://*.clerk.accounts.dev https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
