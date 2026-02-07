import Link from 'next/link';
import {
  Shield,
  QrCode,
  Leaf,
  TrendingUp,
  Truck,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Lock,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-white py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <Lock className="w-4 h-4 mr-2" />
              Blockchain Verified Authenticity
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track Your Product's Journey{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                From Farm to Table
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Complete supply chain transparency powered by blockchain technology.
              Verify product authenticity, quality certifications, and origin with a simple scan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/scan"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan Product
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-green-500 hover:text-green-600 transition-all"
              >
                Enter Batch ID
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Products Tracked' },
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '50+', label: 'Supply Partners' },
              { value: '24/7', label: 'Real-time Updates' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How TraceRoot Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to verify your product's authenticity and journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Smartphone,
                title: 'Scan the Code',
                description: 'Use your smartphone to scan the QR code or NFC tag on the product',
              },
              {
                icon: Shield,
                title: 'Verify Authenticity',
                description: 'Our blockchain verifies the product is genuine and untampered',
              },
              {
                icon: TrendingUp,
                title: 'View Full Journey',
                description: 'See the complete supply chain journey from origin to your hands',
              },
            ].map((step, index) => (
              <div key={index} className="relative bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TraceRoot
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Industry-leading technology for complete supply chain transparency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: 'Blockchain Security',
                description: 'Immutable records stored on Ethereum blockchain for tamper-proof verification',
              },
              {
                icon: QrCode,
                title: 'QR & NFC Support',
                description: 'Scan with any smartphone using QR codes or NFC technology',
              },
              {
                icon: Leaf,
                title: 'Quality Certifications',
                description: 'View USDA Organic, Fair Trade, ISO and other certifications',
              },
              {
                icon: Truck,
                title: 'Real-time Tracking',
                description: 'Follow your product through every step of the supply chain',
              },
              {
                icon: BarChart3,
                title: 'Lab Test Reports',
                description: 'Access detailed quality metrics and laboratory test results',
              },
              {
                icon: CheckCircle,
                title: 'Instant Verification',
                description: 'Get instant confirmation of product authenticity',
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border hover:border-green-500 transition-colors group">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                  <feature.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Verify Your Product?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Scan the QR code or enter the batch ID to view complete product information
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Start Verification
          </Link>
        </div>
      </section>
    </div>
  );
}
