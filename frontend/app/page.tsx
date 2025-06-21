"use client"

import { GoogleMapsEmbed } from "@next/third-parties/google"
import { useState } from "react"
import { X } from "lucide-react"

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<"about" | "contact" | null>(null)

  const openModal = (modal: "about" | "contact") => {
    setActiveModal(modal)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setActiveModal(null)
    document.body.style.overflow = "unset"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-white cursor-pointer">MapSite</span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-8">
              <button
                onClick={() => openModal("about")}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800/50"
              >
                About
              </button>
              <button
                onClick={() => openModal("contact")}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800/50"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
              Smart mapping for smarter driving
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Visualize traffic ticket hotspots on the map. Plan ahead and stay informed with cutting-edge location tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors">
                Get Started
              </button>
              <button className="border border-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 pointer-events-none" />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Map Section */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-gray-800">
            <h2 className="text-3xl font-bold text-white mb-4">Explore Our Location</h2>
            <p className="text-gray-400 text-lg">
              Interactive mapping powered by Google Maps. Find us with precision and ease.
            </p>
          </div>

          <div className="relative">
            {/* Loading placeholder */}
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-white mx-auto mb-4"></div>
                <p className="text-gray-400">Loading interactive map...</p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <GoogleMapsEmbed
              apiKey="YOUR_GOOGLE_MAPS_API_KEY"
              height={600}
              width="100%"
              mode="place"
              q="Times+Square,New+York,NY"
              zoom="15"
              maptype="roadmap"
              loading="lazy"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 backdrop-blur-sm hover:bg-gray-800/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white text-xl">📍</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Precise Location</h3>
            <p className="text-gray-400 mb-4">
              Get exact coordinates and detailed location information with our advanced mapping technology.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📍 123 Main Street</p>
              <p>🏙️ New York, NY 10001</p>
              <p>📞 (555) 123-4567</p>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 backdrop-blur-sm hover:bg-gray-800/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white text-xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Fast Performance</h3>
            <p className="text-gray-400 mb-4">
              Lightning-fast map loading with optimized performance and smooth interactions.
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Learn more →</button>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 backdrop-blur-sm hover:bg-gray-800/50 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Smart Navigation</h3>
            <p className="text-gray-400 mb-4">
              Intelligent routing and real-time directions to help you reach your destination efficiently.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
              Get Directions
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">&lt; 100ms</div>
              <div className="text-gray-400 text-sm">Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">Global</div>
              <div className="text-gray-400 text-sm">Coverage</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 MapSite. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {activeModal === "about" && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={closeModal} />

            {/* Modal Content */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                  About MapSite
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-8">
                  <p className="text-xl text-gray-400 mb-6">
                    Building the future of driver awareness through smart location data
                  </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                  <div className="space-y-4 text-gray-300">
                    <p>
                      At MapSite, we believe drivers deserve more than just directions they deserve insight. We're building intelligent mapping tools that show where traffic tickets are being issued, helping users make informed decisions on the road.
                    </p>
                    <p>
                      Our platform integrates real-time data with the power of modern web technology and mapping systems to create a seamless, responsive experience. Whether you're navigating your daily commute or planning a road trip, MapSite helps you avoid trouble spots and drive smarter.
                    </p>
                    <p>
                      Founded in 2025, we're committed to redefining how location data is used — with transparency, usability, and privacy at the core.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Our Values</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Data that empowers, not overwhelms
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Design that informs clearly and beautifully
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Privacy and security by default
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                        Accessible tools for drivers everywhere
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Technology Stack</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">React & Next.js</span>
                        <span className="text-blue-400 text-sm">Frontend</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Google Maps API</span>
                        <span className="text-green-400 text-sm">Mapping</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Tailwind CSS</span>
                        <span className="text-purple-400 text-sm">Styling</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Vercel</span>
                        <span className="text-pink-400 text-sm">Deployment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {activeModal === "contact" && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={closeModal} />

            {/* Modal Content */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                  Get in Touch
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-8">
                  <p className="text-xl text-gray-400">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Info */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">📍</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Address</h4>
                          <p className="text-gray-400">
                            123 Main Street
                            <br />
                            New York, NY 10001
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">📞</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Phone</h4>
                          <p className="text-gray-400">(555) 123-4567</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">✉️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Email</h4>
                          <p className="text-gray-400">hello@mapsite.com</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">🕒</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">Business Hours</h4>
                          <p className="text-gray-400">
                            Monday - Friday
                            <br />
                            9:00 AM - 6:00 PM EST
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="How can we help?"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                          placeholder="Tell us more about your inquiry..."
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
