"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "How We Work", href: "/#how-we-work" },
  { label: "Our Team", href: "/#team" },
  { label: "FAQ", href: "/#faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if it's a hash link
    if (href.includes("#")) {
      const hash = href.split("#")[1];
      const targetElement = document.getElementById(hash);

      // If the element exists on the current page, manually scroll to it
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Update the URL history without triggering a jump
        window.history.pushState(null, "", `/#${hash}`);
        setIsOpen(false); // Close mobile menu if it was open
        return;
      }
    }
    
    // For non-hash links or if the element isn't on the current page, 
    // just close the menu and let Next.js handle the routing normally
    setIsOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        backgroundColor: "#0B1F3B",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? "-100%" : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="mx-auto flex h-18 max-w-6xl px-6 xl:px-0 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo-white.png"
            alt="Stackd Logo"
            className="h-4 w-auto object-contain lg:4-3.5"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center lg:flex">
          <Link href="/book" passHref legacyBehavior>
            <motion.a
              className="group relative overflow-hidden rounded-md border-b-2 border-[#2F80ED] px-5 py-2.5 text-sm font-semibold text-white"
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute inset-x-0 bottom-0 h-0 bg-[#2F80ED] transition-all duration-300 ease-out group-hover:h-full" />
              <span className="relative z-10">Book a demo</span>
            </motion.a>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="p-1 text-white/80 hover:text-white lg:hidden"
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
            className="border-t border-white/10 bg-[#0B1F3B] lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="mt-2 rounded-md bg-[#2F80ED] px-5 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setIsOpen(false)}
              >
                Book a demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
