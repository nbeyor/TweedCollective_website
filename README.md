# Tweed Collective Website

A modern, professional corporate website for Tweed Collective - a fractional-operator platform that helps growth-stage health-tech companies and their investors accelerate revenue and scale through hands-on execution and AI-driven strategy.

## 🚀 Features

- **Modern Design**: Clean, professional design with deep navy and soft accent color palette
- **Responsive**: Mobile-first responsive design that works on all devices
- **Performance**: Built with Next.js 14 for optimal performance and SEO
- **Accessibility**: WCAG compliant with proper semantic HTML and ARIA labels
- **SEO Optimized**: Meta tags, structured data, and optimized content

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **TypeScript**: Full type safety
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Homepage
│   ├── services/
│   │   └── page.tsx         # Services page
│   └── contact/
│       └── page.tsx         # Contact page
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section
│   ├── Stats.tsx            # Statistics section
│   ├── Services.tsx         # Services overview
│   ├── CaseStudies.tsx      # Portfolio case studies
│   └── Footer.tsx           # Footer with links
├── tailwind.config.js       # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Primary**: Deep blue gradient (#4a4bff to #5b6bff)
- **Navy**: Dark navy (#1a1f26 to #2e3742)
- **Accent**: Green (#22c55e)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive**: Fluid typography scaling

### Components
- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Hover effects and consistent spacing
- **Forms**: Accessible form controls with focus states
- **Navigation**: Sticky header with mobile menu

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tweed-collective-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages

### Homepage (`/`)
- Hero section with value proposition
- Key statistics and trust indicators
- Services overview (Operations, Advisory, Incubation)
- Case studies showcase
- Contact CTA

### Services (`/services`)
- Detailed service descriptions
- Benefits and deliverables for each service
- Engagement models
- Process overview

### Contact (`/contact`)
- Contact form with validation
- Company information
- Office hours and response times
- What to expect section

## 🎯 Key Features

### Operations
- Embedded fractional executives & teams
- Go-to-market strategy and execution
- Product development and RevOps
- Organizational scaling

### Advisory
- Strategic counsel to boards & investors
- Market analysis and competitive intelligence
- Commercial due diligence
- Investment thesis development

### Incubation
- Studio approach for new ventures
- Concept validation and MVP development
- Seed funding preparation
- Talent network access

## 🔧 Customization

### Updating Content
- Edit content in the respective page components
- Update case studies in `components/CaseStudies.tsx`
- Modify services in `components/Services.tsx`

### Styling
- Customize colors in `tailwind.config.js`
- Add new components in the `components/` directory
- Modify global styles in `app/globals.css`

### SEO
- Update metadata in `app/layout.tsx`
- Add page-specific metadata in individual pages
- Optimize images and content for search engines

## 📱 Responsive Design

The website is built with a mobile-first approach and includes:
- Responsive navigation with hamburger menu
- Fluid typography and spacing
- Optimized images and layouts
- Touch-friendly interactive elements

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatibility

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Environment variables for production

### Static Export
```bash
npm run build
npm run export
```

## 📞 Support

For questions or support, contact:
- **Email**: hello@tweedcollective.com
- **Phone**: +1 (234) 567-890

## 📄 License

This project is proprietary to Tweed Collective. All rights reserved.

---

Built with ❤️ for Tweed Collective 