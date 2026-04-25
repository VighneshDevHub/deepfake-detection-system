"use client";

import Link from "next/link";
import { LayoutDashboard, Menu, X, Image as ImageIcon, Film, Mic, FileText } from "lucide-react";
import { Button } from "../ui/Button";
import { Logo } from "../shared/Logo";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useCurrentUser();

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "How it Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="icon" className="rounded-full text-zinc-400">
                <span className="font-bold">GH</span>
              </Button>
            </Link>
            {!user ? (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm" className="rounded-full border-white/10 px-6 font-bold text-white hover:bg-white/5">
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="rounded-full bg-primary font-black text-background-dark hover:bg-primary/90 glow-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="sm" className="rounded-full bg-primary font-black text-background-dark hover:bg-primary/90 glow-primary px-6">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-background-dark px-4 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest text-zinc-400 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className="text-lg font-medium text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!user ? (
                <>
                  <Link
                    href="/sign-in"
                    className="text-lg font-medium text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-lg font-medium text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-lg font-medium text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
