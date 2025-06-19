import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-navy-50 to-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6">
              Let's Talk
            </h1>
            <p className="text-xl md:text-2xl text-navy-600 mb-8">
              Ready to accelerate your health-tech company's growth? We'd love to hear about your challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-6">Get in Touch</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-navy-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-navy-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-navy-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-navy-700 mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="operations">Operations</option>
                      <option value="advisory">Advisory</option>
                      <option value="incubation">Incubation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-navy-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about your business challenges and how we can help..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">Get in Touch</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600">📧</span>
                        </div>
                        <div>
                          <p className="font-medium text-navy-900">Email</p>
                          <a href="mailto:hello@tweedcollective.com" className="text-primary-600 hover:text-primary-700">
                            hello@tweedcollective.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600">📞</span>
                        </div>
                        <div>
                          <p className="font-medium text-navy-900">Phone</p>
                          <a href="tel:+1234567890" className="text-primary-600 hover:text-primary-700">
                            +1 (234) 567-890
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600">📍</span>
                        </div>
                        <div>
                          <p className="font-medium text-navy-900">Location</p>
                          <p className="text-navy-600">San Francisco, CA</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">Office Hours</h3>
                    <div className="space-y-2 text-navy-600">
                      <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PST</p>
                      <p><strong>Saturday:</strong> By appointment</p>
                      <p><strong>Sunday:</strong> Closed</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">Response Time</h3>
                    <p className="text-navy-600">
                      We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                    </p>
                  </div>

                  <div className="bg-navy-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-navy-900 mb-3">What to Expect</h3>
                    <ul className="space-y-2 text-navy-600">
                      <li>• Initial consultation within 24 hours</li>
                      <li>• Custom proposal within 1 week</li>
                      <li>• Project kickoff within 2 weeks</li>
                      <li>• Regular progress updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default ContactPage 