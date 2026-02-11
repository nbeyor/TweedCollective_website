/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Ensure the generated dashboard HTML is bundled into the serverless function
  outputFileTracingIncludes: {
    '/api/dashboard-content': ['./content/documents/dashboard.html'],
  },
}

module.exports = nextConfig