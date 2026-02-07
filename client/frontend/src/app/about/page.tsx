import {
    Leaf,
    Shield,
    Users,
    Globe,
    Target,
    CheckCircle,
    Zap,
    Lock
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden">
            {/* Hero */}
            <section className="py-20 bg-gradient-to-br from-green-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                            <Leaf className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            About TraceRoot
                        </h1>
                        <p className="text-xl text-gray-600">
                            A blockchain-powered supply chain traceability platform that brings transparency and trust to every product journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 mb-4">
                                TraceRoot was created to solve the growing problem of supply chain opacity.
                                In a world where consumers demand to know where their products come from,
                                we provide the technology to make that possible.
                            </p>
                            <p className="text-gray-600">
                                Using blockchain technology, we ensure that every step of a product's journey
                                is recorded immutably, giving consumers confidence in the authenticity and
                                quality of what they purchase.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Shield, label: 'Verified', value: '100%' },
                                { icon: Users, label: 'Partners', value: '50+' },
                                { icon: Globe, label: 'Countries', value: '12' },
                                { icon: Target, label: 'Accuracy', value: '99.9%' },
                            ].map((stat, index) => (
                                <div key={index} className="p-6 bg-green-50 rounded-xl text-center">
                                    <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                icon: CheckCircle,
                                title: 'Transparency',
                                description: 'Every transaction and movement is recorded on an immutable blockchain ledger',
                            },
                            {
                                icon: Zap,
                                title: 'Efficiency',
                                description: 'Real-time tracking and instant verification saves time for all stakeholders',
                            },
                            {
                                icon: Lock,
                                title: 'Security',
                                description: 'Blockchain technology ensures data cannot be tampered with or falsified',
                            },
                        ].map((value, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-7 h-7 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Technology</h2>
                        <div className="space-y-4">
                            {[
                                { title: 'Ethereum Blockchain', desc: 'Smart contracts for immutable record keeping' },
                                { title: 'NFC & QR Integration', desc: 'Multiple scanning options for easy verification' },
                                { title: 'Quality Metrics', desc: 'Lab test results and certifications on-chain' },
                                { title: 'Real-time Updates', desc: 'Track products as they move through the supply chain' },
                            ].map((tech, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:border-green-500 transition-colors">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{tech.title}</h4>
                                        <p className="text-sm text-gray-600">{tech.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
