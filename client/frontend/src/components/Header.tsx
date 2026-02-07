'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Leaf, QrCode, Shield, Info } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home', icon: Leaf },
        { href: '/verify', label: 'Verify Product', icon: QrCode },
        { href: '/scan', label: 'Scan QR', icon: Shield },
        { href: '/about', label: 'About', icon: Info },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        TraceRoot
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                        >
                            <link.icon className="w-4 h-4" />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* CTA Button */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link
                        href="/scan"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        <QrCode className="w-4 h-4 mr-2" />
                        Scan Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6 text-gray-600" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-600" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <nav className="container mx-auto px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <link.icon className="w-5 h-5" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
