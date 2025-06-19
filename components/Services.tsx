import React from 'react'

const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Strategy & Planning</h3>
            <p className="text-gray-600">
              We help organizations develop comprehensive strategies and actionable plans to achieve their goals.
            </p>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Implementation Support</h3>
            <p className="text-gray-600">
              Our team provides hands-on support to ensure successful implementation of strategic initiatives.
            </p>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Impact Assessment</h3>
            <p className="text-gray-600">
              We measure and evaluate the impact of programs and initiatives to drive continuous improvement.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services 