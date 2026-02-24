"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "How We Work", href: "#how-we-work" },
    { label: "Our Team", href: "#team" },
    { label: "The Process", href: "#process" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor: scrolled ? "#0B1F3B" : "#0B1F3B",
                boxShadow: scrolled
                    ? "0 1px 0 rgba(255,255,255,0.06)"
                    : "none",
            }}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <a
                    href="#"
                    className="text-white font-bold text-xl tracking-[0.15em] uppercase select-none"
                >
                    STACKD
                </a>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center">
                    <motion.a
                        href="#contact"
                        className="bg-[#2F80ED] hover:bg-[#2570d4] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors duration-200"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Book a Strategy Call
                    </motion.a>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-white/80 hover:text-white p-1"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-[#0B1F3B] border-t border-white/10"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-white/70 hover:text-white text-sm font-medium transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                className="bg-[#2F80ED] text-white text-sm font-semibold px-5 py-3 rounded-md text-center mt-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Book a Strategy Call
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
