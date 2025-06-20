'use client'

import React, { useState } from 'react'
import { useContactForm } from '@/hooks/useAirtable'
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  })

  const { submitForm, loading, error, success } = useContactForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await submitForm(formData)
      setFormData({ name: '', email: '', company: '', service: '', message: '' })
    } catch (err) {
      // Error is handled by the hook
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="section bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Let's Talk</h1>
            <p className="body-large mb-8">
              Ready to accelerate your health-tech company's growth? We'd love to hear about your challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="mb-6">Get in Touch</h2>
                
                {success && (
                  <div className="mb-6 p-4 bg-sage/10 border border-sage/20 rounded-lg flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-sage" />
                    <p className="text-sage">Thank you! We'll get back to you within 24 hours.</p>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-coral/10 border border-coral/20 rounded-lg flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-coral" />
                    <p className="text-coral">Something went wrong. Please try again or contact us directly.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="form-label">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="form-label">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select a service</option>
                      <option value="operations">Operations</option>
                      <option value="advisory">Advisory</option>
                      <option value="incubation">Incubation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="form-input"
                      placeholder="Tell us about your business challenges and how we can help..."
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-sage" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">Email</p>
                          <a href="mailto:hello@tweedcollective.com" className="text-sage hover:text-sage/80">
                            hello@tweedcollective.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-sage" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">Phone</p>
                          <a href="tel:+1234567890" className="text-sage hover:text-sage/80">
                            +1 (234) 567-890
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-sage" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">Location</p>
                          <p className="text-warm-gray">San Francisco, CA</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4">Office Hours</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-5 h-5 text-sage" />
                      <div>
                        <p className="text-warm-gray"><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PST</p>
                        <p className="text-warm-gray"><strong>Saturday:</strong> By appointment</p>
                        <p className="text-warm-gray"><strong>Sunday:</strong> Closed</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4">Response Time</h3>
                    <p className="text-warm-gray">
                      We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                    </p>
                  </div>

                  <div className="card p-6">
                    <h3 className="mb-3">What to Expect</h3>
                    <ul className="space-y-2 text-warm-gray">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-sage" />
                        <span>Initial consultation within 24 hours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-sage" />
                        <span>Custom proposal within 1 week</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-sage" />
                        <span>Project kickoff within 2 weeks</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-sage" />
                        <span>Regular progress updates</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-stone/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-8">Ready to accelerate your growth?</h2>
            <a href="mailto:hello@tweedcollective.com" className="btn-primary text-lg px-8 py-4">
              Schedule a Call
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 