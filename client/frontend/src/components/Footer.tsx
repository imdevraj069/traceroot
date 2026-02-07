import Link from 'next/link';
import { Leaf, Github, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">TraceRoot</span>
                        </Link>
                        <p className="text-sm text-gray-400">
                            Blockchain-powered supply chain traceability from farm to consumer.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-green-400 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/verify" className="hover:text-green-400 transition-colors">
                                    Verify Product
                                </Link>
                            </li>
                            <li>
                                <Link href="/scan" className="hover:text-green-400 transition-colors">
                                    Scan QR Code
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-green-400 transition-colors">
                                    About TraceRoot
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Features</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Blockchain Verification</li>
                            <li>NFC Authentication</li>
                            <li>Quality Tracking</li>
                            <li>Supply Chain Visibility</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>Bangalore, India</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>+91 123 456 7890</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>hello@traceroot.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>© 2026 TraceRoot. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
