import React from 'react'
import Image from 'next/image'

const insights = [
  {
    title: "The Future of Value-Based Care in Digital Health",
    excerpt: "How emerging technologies and payment models are reshaping healthcare delivery and outcomes.",
    category: "Industry Analysis",
    readTime: "8 min read",
    author: {
      name: "Dr. Sarah Chen",
      role: "Partner",
      image: "/team/placeholder1.jpg"
    },
    tags: ["Value-Based Care", "Digital Health", "Healthcare Policy"]
  },
  {
    title: "Building AI-First Healthcare Companies",
    excerpt: "Key considerations and frameworks for developing and scaling AI solutions in regulated markets.",
    category: "Technology",
    readTime: "12 min read",
    author: {
      name: "Dr. Emily Watson",
      role: "Partner",
      image: "/team/placeholder3.jpg"
    },
    tags: ["AI/ML", "Healthcare", "Product Strategy"]
  },
  {
    title: "GTM Excellence in Health-Tech",
    excerpt: "Best practices and common pitfalls in healthcare go-to-market strategy and execution.",
    category: "Strategy",
    readTime: "10 min read",
    author: {
      name: "Michael Torres",
      role: "Partner",
      image: "/team/placeholder2.jpg"
    },
    tags: ["GTM", "Sales", "Healthcare"]
  }
]

const newsletters = [
  {
    title: "Weekly Health-Tech Roundup",
    description: "Curated analysis of the week's most important health-tech developments.",
    frequency: "Every Monday"
  },
  {
    title: "Operator Deep Dives",
    description: "Monthly long-form analysis of emerging trends and opportunities.",
    frequency: "First Thursday"
  }
]

export default function Insights() {
  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <h1 className="mb-6">Insights</h1>
        <p className="body-large text-neutral-warm-gray max-w-2xl">
          Analysis and perspectives from our network of operators on the frontlines of health-tech innovation.
        </p>
      </section>

      {/* Featured Article */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Image Side */}
            <div className="md:w-1/2 h-64 md:h-auto relative bg-neutral-stone/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-sage/40 text-xl font-medium">Featured Image</span>
              </div>
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-primary-coral">Featured</span>
                <span className="text-sm text-neutral-warm-gray">12 min read</span>
              </div>

              <h2 className="mb-4">The State of Health-Tech 2024</h2>
              <p className="text-neutral-warm-gray mb-8">
                Our annual analysis of the health-tech landscape: key trends, emerging opportunities, and predictions for the year ahead.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-stone/20 flex items-center justify-center">
                  <span className="text-primary-sage text-sm">TC</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Tweed Collective</p>
                  <p className="text-sm text-neutral-warm-gray">January 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="mb-8">Latest Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((insight) => (
            <div 
              key={insight.title}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary-coral">{insight.category}</span>
                  <span className="text-sm text-neutral-warm-gray">{insight.readTime}</span>
                </div>

                <h3 className="mb-4">{insight.title}</h3>
                <p className="text-neutral-warm-gray mb-6">{insight.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {insight.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 bg-neutral-stone/30 rounded-full text-neutral-warm-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-stone/20 flex items-center justify-center">
                    <span className="text-primary-sage text-xs">
                      {insight.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.author.name}</p>
                    <p className="text-xs text-neutral-warm-gray">{insight.author.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4">
        <div className="bg-neutral-stone/30 rounded-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-4">Subscribe to Our Newsletter</h2>
            <p className="body-large text-neutral-warm-gray mb-8">
              Get the latest health-tech insights and analysis delivered to your inbox.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {newsletters.map((newsletter) => (
                <div 
                  key={newsletter.title}
                  className="bg-white rounded-lg p-6"
                >
                  <h4 className="mb-2">{newsletter.title}</h4>
                  <p className="text-sm text-neutral-warm-gray mb-4">{newsletter.description}</p>
                  <p className="text-xs text-primary-sage">{newsletter.frequency}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-stone focus:outline-none focus:border-primary-sage"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 