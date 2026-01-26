'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const footerLinks = [
  { href: '/archive', label: 'Archive' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
];

// Reverse ROYGBIV (VIBGYOR) color sequence
const vibgyorColors = [
  'rgba(175, 82, 222, 0.15)',  // Violet
  'rgba(88, 86, 214, 0.15)',   // Indigo
  'rgba(0, 122, 255, 0.15)',   // Blue
  'rgba(52, 199, 89, 0.15)',   // Green
  'rgba(255, 204, 0, 0.15)',   // Yellow
  'rgba(255, 149, 0, 0.15)',   // Orange
  'rgba(255, 59, 48, 0.15)',   // Red
  'rgba(175, 82, 222, 0.15)',  // Back to Violet (seamless loop)
];

export function Footer() {
  const pathname = usePathname();

  return (
    <motion.footer
      animate={{ backgroundColor: vibgyorColors }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="border-t border-neutral-200 dark:border-neutral-800 mt-auto backdrop-blur-sm"
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex justify-center gap-6 mb-4">
          {footerLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Made with ❤🧠 && Next.JS, Vercel, Anthropic  
        </p>
      </div>
    </motion.footer>
  );
}
